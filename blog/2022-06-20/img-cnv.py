# -*- coding: utf-8 -*-
"""
Created on 220620
Last updated on 220620

Author: Hong-Yi Zhang
Website: hongyi18.github.io
Email: hongyi@rice.edu

Description: Convert image formats.
"""

import os
from PIL import Image


def img_conversion(img_src, img_dst):
    """
    This function convert one single image to the desired format.

    Parameters
    ----------
    img_src : strings
        Image source. For example, 'folder/my_pic.fig'.
    img_dst : strings
        Image destination. For example, 'folder/my_pic.png'.
    """
    im = Image.open(img_src)
    rgb_im = im.convert('RGB')
    rgb_im.save(img_dst)
    return None

def imgs_conversion(img_src, img_dst, dst_format='png'):
    """
    This function convert multiple images to the desired format.

    Parameters
    ----------
    img_src : strings
        Image source directory. For example, 'folder/'. The function will exam-
        ine all files in the directory.
    img_dst : strings
        The desitination directory. For example, 'folder/new/'.
    dst_format : strings, optional
        Desired format of images. The default is 'png'.
    """
    img_list = os.listdir(img_src)
    
    # Create the trajectory "img_dst" if it doesn't exist.
    if not os.path.exists(img_dst):
        os.makedirs(img_dst)

    for img in img_list:
        try:
            img_name = img[:img.rindex('.')]
            img_conversion(img_src+img, img_dst+img_name+'.'+dst_format)
        except:
            print('The file \'%s\' is not supported.' % img)
    print('Conversion is finished!')
    return None

if __name__ == '__main__':
    img_conversion('tasi_logo.jpg', 'tasi_logo.jpg')
    imgs_conversion('tasi_pic/', 'tasi_pic_jpg/', 'jpg')