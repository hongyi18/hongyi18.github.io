# -*- coding: utf-8 -*-
"""
Created on 220620
Last updated on 220620

Author: Hong-Yi Zhang
Website: hongyi18.github.io
Email: hongyi@rice.edu

Description: Make photographic mosaics.
    Read http://danielballan.github.io/photomosaic/docs/tutorial.html for docs.
"""

import photomosaic as pm
import numpy as np
from skimage import img_as_float
from skimage.io import imsave


# Dimension of the mosaic picture.
dims = (15, 50)
# The optional depth parameter selectively splits tiles into quadrants 
# if they contain a certain amount of contrast.
depth = 4 


# Basic mosaic.
image = pm.imread('tasi_logo.jpg')  # Read the main image.
pool = pm.make_pool('tasi_pic_jpg/*.jpg')  # Read a pool of picture blocks.
mos_basic = pm.basic_mosaic(image, pool, dims, depth=depth)  # Draw a basic mosaic.
imsave('mos_basic.jpg', mos_basic)


# Advanced mosaic. This section is based on previous settings, so usually there
# is no need to modify it. 

# Prepare the image.
image = img_as_float(image)  # The image is represented by float values in 0-1.
converted_img = pm.perceptual(image)
adapted_img = pm.adapt_to_pool(converted_img, pool)
scaled_img = pm.rescale_commensurate(adapted_img, grid_dims=dims, depth=depth)
tiles = pm.partition(scaled_img, grid_dims=dims, depth=depth)
annotated_img = pm.draw_tile_layout(pm.rgb(scaled_img), tiles)

# Match Tiles to Pool Images
tile_colors = [np.mean(scaled_img[tile].reshape(-1, 3), 0) for tile in tiles]
match = pm.simple_matcher(pool)
matches = [match(tc) for tc in tile_colors]

# Draw mosaic.
canvas = np.ones_like(scaled_img) # white canvas
vancas = np.zeros_like(scaled_img) # black canvas
mos_advanced = pm.draw_mosaic(canvas, tiles, matches)
imsave('mos_advanced.jpg', mos_advanced)