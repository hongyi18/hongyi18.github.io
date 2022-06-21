---
layout: post
title: "Simple steps to make photomosaics with Python"
categories: random
author:
- Hong-Yi Zhang
---

Fancy photographic mosaics appear everywhere, and many of them are made by professional softwares like Photoshop or Foto-Mosaik-Edda. However, things often become simple in Python. In this article, I will introduce the basic steps to make photomosaics. 

<figure>
  <p align="center" width="100%">
    <img title="Franz Peter Schubert" src="schubert.png" alt="Picture" width="30%">        
  </p>
  <center>
    <figcaption style="width:60%"> <em> Franz Peter Schubert, one of my favoriate musician. This portrait is a photomosaic made up of pure color squares.</em>
    </figcaption>
  </center>
</figure>

First, we need to install photomosaic package

```python
pip install photomosaic
```

Then it only takes 3 steps to make a basic photographic mosaic with dimension 30*30:

```python
import photomosaic as pm
from skimage.io import imsave

image = pm.imread('main_image.fig')  # Read the main image.
pool = pm.make_pool('pool/*.fig')  # Read a pool of picture blocks.
mos_basic = pm.basic_mosaic(image, pool, (30, 30), depth=1)  # Draw a basic mosaic.

imsave('mos_basic.png', mos_basic)
```

In case you don't have enough image blocks to make a pool, you can create pure-color square by using

```python
pm.rainbow_of_squares('pool/')
```

A more advanced example is given [here](2022-06-20-simple-steps-to make-photomosaics-with-python/mosaic.py).

### Some issues

The "photomosaic" module is a bit outdated and in some cases you may get an error

```python
TypeError: slice indices must be integers or None or have an __index__ method
```

This error happens because the photomosaic module uses numpy, where "np.floor()" and "np.ceil()" can return float numbers in updated versions. To solve this problem, open the script "photomosaic.py" in the location where the module is downloaded, and then change line 867 and 868 to

```python
left_margin = int(np.floor(overflow / 2))
right_margin = int(np.ceil(overflow / 2))
```

making both "left_margin" and "right_margin" intergers.

Many other issues that may arise can usually be resolved by converting your images to RGB jpg format, see [img_cnv.py](2022-06-20-simple-steps-to make-photomosaics-with-python/img_cnv.py). These issues include, for example,

```python
ValueError: operands could not be broadcast together with remapped shapes [original->remapped]: (3,3)->(3,3) (720,3600,4)->(720,3600,newaxis,4)
```

### Acknowledgements

This article is prepared for my "squarks" talk in TASI 2022, CU Boulder, where I had a great time learning frontier physics and making friends. Some of my pool pictures are from TASI activities, but there are only 195 and many of them have similar backgrounds. So I add another 1152 pictures of cats, dogs and cartoon characters from the Internet.

<p align="center" width="100%">
  <img title="TASI logo" src="tasi_logo.fig" alt="Picture" width="70%">        
  <img title="TASI logo mos1" src="tasi_logo_mos1.fig" alt="Picture" width="70%">
  <img title="TASI logo mos2" src="tasi_logo_mos2.fig" alt="Picture" width="70%">
  <img title="TASI logo mos3" src="tasi_logo_mos3.fig" alt="Picture" width="70%">
</p>