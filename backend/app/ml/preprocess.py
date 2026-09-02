"""
Synchrosqueezing Transform (SST) EEG Preprocessing Pipeline
============================================================
Citation:
    Özdemir, M. K., & Kaya, Y. (2020/2021).
    "Epileptic EEG Classification Using Deep Learning and Synchrosqueezing Transform."
    GitHub reference: https://github.com/mkfzdmr/Epileptic-EEG-Classfication-Using-Deep-Learning

Description:
    Processes raw single-channel/montage EEG segments (e.g., from the PhysioNet CHB-MIT database)
    and transforms the 1D time-series into a 128x128 Synchrosqueezing Transform (SST) time-frequency
    representation. The synchrosqueezed representation sharpens continuous wavelet transforms (CWT)
    along the frequency axis, capturing localized non-stationary epileptic oscillations.
"""

from typing import Optional, Tuple, Union
import struct
import zlib
import numpy as np

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

try:
    from ssqueezepy import ssq_cwt
    HAS_SSQUEEZEPY = True
except ImportError:
    HAS_SSQUEEZEPY = False


def compute_sst(
    signal_segment: np.ndarray,
    sampling_rate: int = 256,
    wavelet: str = "morlet",
    scales: str = "log-piecewise",
) -> np.ndarray:
    """
    Computes the Synchrosqueezing Transform (SST) magnitude of a 1D EEG signal segment.
    """
    signal = np.asarray(signal_segment, dtype=np.float32)
    # Zero-mean and variance normalization
    signal = signal - np.mean(signal)
    std = float(np.std(signal))
    if std > 1e-8:
        signal = signal / std

    if HAS_SSQUEEZEPY:
        Tx, _, _, _ = ssq_cwt(signal, wavelet=wavelet, scales=scales, fs=sampling_rate)
        magnitude = np.abs(Tx)
    else:
        # High-performance analytic Morlet filter bank
        n = len(signal)
        frequencies = np.geomspace(0.5, 60.0, num=128, dtype=np.float32)
        magnitude = np.zeros((len(frequencies), n), dtype=np.float32)
        fft_sig = np.fft.fft(signal)
        freq_grid = np.fft.fftfreq(n, d=1.0 / float(sampling_rate))
        
        for idx, f0 in enumerate(frequencies):
            sigma_f = f0 / 6.0
            gaussian_window = np.exp(-0.5 * ((freq_grid - f0) / sigma_f) ** 2)
            cwt_f = np.fft.ifft(fft_sig * gaussian_window)
            magnitude[idx, :] = np.abs(cwt_f)

    # Dynamic range log-scaling
    magnitude = np.log1p(magnitude)
    return magnitude


def numpy_resize_2d(matrix: np.ndarray, target_shape: Tuple[int, int] = (128, 128)) -> np.ndarray:
    """
    Pure vectorized bilinear interpolation resize in numpy.
    """
    in_h, in_w = matrix.shape
    out_h, out_w = target_shape

    row_coords = np.linspace(0, in_h - 1, out_h)
    col_coords = np.linspace(0, in_w - 1, out_w)

    r0 = np.floor(row_coords).astype(int)
    r1 = np.clip(r0 + 1, 0, in_h - 1)
    dr = (row_coords - r0)[:, None]

    c0 = np.floor(col_coords).astype(int)
    c1 = np.clip(c0 + 1, 0, in_w - 1)
    dc = (col_coords - c0)[None, :]

    top_left = matrix[np.ix_(r0, c0)]
    top_right = matrix[np.ix_(r0, c1)]
    bottom_left = matrix[np.ix_(r1, c0)]
    bottom_right = matrix[np.ix_(r1, c1)]

    top = top_left * (1.0 - dc) + top_right * dc
    bottom = bottom_left * (1.0 - dc) + bottom_right * dc

    resized = top * (1.0 - dr) + bottom * dr
    return resized.astype(np.float32)


def resize_and_normalize_sst(
    sst_matrix: np.ndarray,
    target_size: Tuple[int, int] = (128, 128),
) -> np.ndarray:
    """
    Resizes the SST time-frequency matrix to target dimensions (128x128) and normalizes to [0, 1].
    """
    min_val = float(np.min(sst_matrix))
    max_val = float(np.max(sst_matrix))
    
    if max_val - min_val > 1e-8:
        norm_matrix = (sst_matrix - min_val) / (max_val - min_val)
    else:
        norm_matrix = np.zeros_like(sst_matrix, dtype=np.float32)

    if HAS_PIL:
        img_uint8 = (norm_matrix * 255.0).astype(np.uint8)
        pil_img = Image.fromarray(img_uint8)
        pil_resized = pil_img.resize(target_size, resample=Image.Resampling.BILINEAR)
        return np.array(pil_resized, dtype=np.float32) / 255.0
    else:
        resized = numpy_resize_2d(norm_matrix, target_shape=target_size)
        return np.clip(resized, 0.0, 1.0)


def process_eeg_segment_to_sst(
    signal_segment: np.ndarray,
    sampling_rate: int = 256,
    target_size: Tuple[int, int] = (128, 128),
) -> np.ndarray:
    """
    End-to-end preprocessing pipeline:
    1D EEG Segment -> SST Calculation -> 128x128 Normalized Image Array.
    """
    sst_raw = compute_sst(signal_segment, sampling_rate=sampling_rate)
    sst_128 = resize_and_normalize_sst(sst_raw, target_size=target_size)
    return sst_128


def _encode_png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    """Encodes a single PNG chunk with CRC checksum."""
    crc = zlib.crc32(chunk_type + data) & 0xffffffff
    return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", crc)


def write_grayscale_png(image_array: np.ndarray, output_path: str) -> None:
    """
    Zero-dependency pure Python PNG writer using standard library zlib.
    """
    h, w = image_array.shape
    uint8_data = (np.clip(image_array, 0.0, 1.0) * 255.0).astype(np.uint8)
    
    # PNG signature
    png_header = b"\x89PNG\r\n\x1a\n"
    
    # IHDR chunk (Width, Height, Bit depth: 8, Color type: 0 (grayscale), Compression: 0, Filter: 0, Interlace: 0)
    ihdr_data = struct.pack(">IIBBBBB", w, h, 8, 0, 0, 0, 0)
    ihdr_chunk = _encode_png_chunk(b"IHDR", ihdr_data)
    
    # IDAT chunk (scanlines prefixed with filter byte 0x00)
    raw_scanlines = bytearray()
    for row in range(h):
        raw_scanlines.append(0)  # None filter
        raw_scanlines.extend(uint8_data[row, :].tobytes())
    
    compressed_data = zlib.compress(bytes(raw_scanlines), level=6)
    idat_chunk = _encode_png_chunk(b"IDAT", compressed_data)
    
    # IEND chunk
    iend_chunk = _encode_png_chunk(b"IEND", b"")
    
    with open(output_path, "wb") as f:
        f.write(png_header + ihdr_chunk + idat_chunk + iend_chunk)


def save_sst_as_png(sst_image: np.ndarray, output_path: str) -> None:
    """
    Saves a 128x128 normalized float array as a PNG image.
    """
    if HAS_PIL:
        img_uint8 = (np.clip(sst_image, 0.0, 1.0) * 255.0).astype(np.uint8)
        pil_img = Image.fromarray(img_uint8, mode="L")
        pil_img.save(output_path, format="PNG", optimize=True)
    else:
        write_grayscale_png(sst_image, output_path)
