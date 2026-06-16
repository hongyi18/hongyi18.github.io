# -*- coding: utf-8 -*-
r"""
Title: Video writer
Author: Hong-Yi Zhang
Website: hongyi18.github.io
Date: Jul 13, 2025

Description: Create a gif or mp4 video from many images.
"""

import imageio.v2 as imageio
import os

# Folder containing images
image_folder = 'snapshots'
# Output movie file
output_file = 'movie.mp4'

# Extract the numerical part of a file name.
def numerical_sort_key(filename):
    base = os.path.basename(filename) # File name, such as 'rho_1.png'.
    name = os.path.splitext(base)[0] # Remove the file extension to get 'rho_1'
    number = int(name.split('_')[1]) # Extract the numerical part to get 1.
    return number

# Get all image filenames, sorted based on the number in the file name.
images = sorted([img for img in os.listdir(image_folder) if img.endswith('.png')], key=numerical_sort_key)

# Create a video writer.
# fps controls the playback speed, i.e. figures per second.
with imageio.get_writer(output_file, fps=20) as writer:
    for filename in images:
        img_path = os.path.join(image_folder, filename)
        image = imageio.imread(img_path)
        writer.append_data(image)

print(f'Done. Video saved to {output_file}.')