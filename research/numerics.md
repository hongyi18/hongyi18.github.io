---
layout: page
title: Numerics
permalink: /research/numerics/
---
Table of contents

* TOC 
{:toc}


### Numerical methods

- Eric Ayars, [Computational physics with python](http://www.fizika.unios.hr/rf/wp-content/uploads/sites/67/2011/02/CPwP.pdf) (Good for beginners).
- Alejandro Garcia, [Numerical Methods for Physics](http://www.algarcia.org/nummeth/nummeth.html) (A more advanced book with examples of Python, Matlab, C/C++ or Fortran).
- Morten Hjorth-Jensen, [COMPUTATIONAL PHYSICS lecture note](https://www.uio.no/studier/emner/matnat/fys/FYS3150/h10/undervisningsmateriale/Lecture Notes/lectures2010.pdf) (A comprehensive guide with examples of C/C++ and Fortran).
- Finite difference method: [Wikipedia: Finite difference coefficient](https://en.wikipedia.org/wiki/Finite_difference_coefficient) and [Finite Difference Coefficients Calculator](http://web.media.mit.edu/~crtaylor/calculator.html).

Numerical relativity

- Miguel Alcubierre, [Introduction to 3+1 Numerical Relativity](https://www.mobt3ath.com/uplode/book/book-45864.pdf).
- Thomas W. Baumgarte, [Numerical Relativity](https://www.cambridge.org/core/books/numerical-relativity/72D4F6D791BC6F8F9CF87A60FC354D6A).



### Programming languages

#### Python

- [廖雪峰python教程](https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000?utm_source=wechat_session&utm_medium=social) (A comprehensive tutorial written in Chinese).
- [Numba makes Python code fast](http://numba.pydata.org/). Tips: Specify the variable types when using numba if you wanna ensure very high precision.

#### Mathematica

- [FAST INTRODUCTION FOR MATH STUDENTS](https://www.wolfram.com/language/fast-introduction-for-math-students/en/) (Good for beginners).
- [An Elementary Introduction to the Wolfram Language](https://www.wolfram.com/language/elementary-introduction/2nd-ed/)
- [Leonid Shifrin, *Mathematica®* programming: an advanced introduction](http://www.mathprogramming-intro.org/)
- [10 Tips for Writing Fast *Mathematica* Code](https://blog.wolfram.com/2011/12/07/10-tips-for-writing-fast-mathematica-code/) (Very helpful tips).
- [How do I accelerate NIntegrate evaluations?](http://support.wolfram.com/kb/12485) (Very helpful tips).
- [Examples for random walk](random_walk.nb)

#### C/C++ and Fortran

- [GCC and Make](https://www3.ntu.edu.sg/home/ehchua/programming/cpp/gcc_make.html)
- [LEARN TO CODE IN 7 LESSONS WITH FORTRAN 90/95](https://www.fortrantutorial.com/)
- [Fortran 90 Tutorial](https://web.stanford.edu/class/me200c/tutorial_90/)



### Data visualization

- Python [matplotlib](https://matplotlib.org/stable/gallery/index.html). (1) Github [matplotlib-cheatsheet](https://github.com/matplotlib/cheatsheets). (2) To customize the plot style (figure size, fonts etc.), just write a “style” file saving in path like “C:\(user name)\.matplotlib\stylelib\” (on Windows). See [customizing matplotlib](https://matplotlib.org/2.0.1/users/customizing.html) and [changes to the default style](https://matplotlib.org/3.1.1/users/dflt_style_changes.html) for detailed description. Download my style file [example](mystyle.mplstyle).
- Mathematica plot.(1) Choose [appropriate plots](https://reference.wolfram.com/language/guide/DataVisualization.html). (2) Do specify [PlotTheme](https://reference.wolfram.com/language/ref/PlotTheme.html). (3) Using [MaTeX](https://github.com/szhorvat/MaTeX) to create LaTeX fonts for ticks and labels.
- [Simple 3D Programming Using VPython](https://www.vpython.org/contents/docs/VisualIntro.html)
- Use [ImageMagick](https://imagemagick.org/) to create .gif from images. (1) **Create .gif**, `convert -delay 50 -loop 0 image_*.png movie.gif`. Here `-delay 50` means the delay between images is 50/100 seconds, `-loop 0` cause the gif to loop over and over again, and the name of images should be in proper alphabetic order like “…, image_09, image_10, image_11, …” instead of “…, image_9, image_10, image_11”.
- Use [FFmpeg](https://www.ffmpeg.org/) to create .flv from images. (1) **Create .flv**, `ffmpeg -i image_%04d.png -r 5 -vcodec flv movie.flv`. Here `-i` specifies the printf string that was used to make the names of the individual plot files, `-r 5` specifies the number of frames per second is 5, and `-vcodec` is the video codec for Flash, which is called `flv`.
- Use [Mathcha](https://www.mathcha.io/) to draw Feynman diagrams.



### Linux and windows

- [Unix/Linux Command Cheat Sheet](https://files.fosswire.com/2007/08/fwunixref.pdf) and [my cheat sheet](numerics_linux.md).
- [UNIX Tutorial for Beginners](http://www.ee.surrey.ac.uk/Teaching/Unix/), [BASH Programming – Introduction HOW-TO](http://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO.html) and [Linux思维导图](https://mp.weixin.qq.com/s?__biz=MzIzNTg3MDQyMQ==&mid=2247485955&idx=3&sn=d25925a933539d55f540143b12ad26d0&chksm=e8e1cbb9df9642af70a10f0abd501f63400e14582854262853b1ca09612c4c77e7bd4adb512c&mpshare=1&scene=1&srcid=1112OeS7C1pmQ5LCe1WplcAh&sharer_sharetime=1573534488008&sharer_shareid=d1611a30a34604128c2a4aa7756c5869&key=b08e6dc0faeae2de81801ef2ffe8508cc27f8ebd991a7a64599ea8b094a6645f3b8b5a86340c621f31ac813f333b2502ca09361f10318ebdbeeb6c47c6489d4a44c7083e4a1deaa6d2af05830b9cb317&ascene=1&uin=ODM4MzYyNzM1&devicetype=Windows+10&version=62070152&lang=en&pass_ticket=Ov13KP%2Fa3sH%2FWr8Zu1CMH0p078d80mg%2BUfaPyebXSQS9Qjs%2FKIAv17ymKrkrMSG3)
- [Vim Cheat Sheet](https://vim.rtorr.com/)
- [Vim/Guide](https://wiki.gentoo.org/wiki/Vim/Guide) and [Vim tips and tricks](https://www.cs.oberlin.edu/~kuperman/help/vim/home.html)
- [Table of Basic PowerShell Commands](https://devblogs.microsoft.com/scripting/table-of-basic-powershell-commands/)
- [BASH and PowerShell Quick Reference](https://cecs.wright.edu/~pmateti/Courses/233/Labs/Scripting/bashVsPowerShellTable.html)
- [Windows Command Prompt Cheatsheet](http://www.cs.columbia.edu/~sedwards/classes/2015/1102-fall/Command Prompt Cheatsheet.pdf)



### High performance computing

#### Using clusters

- [Center for Research Computing documentation at Rice](https://kb.rice.edu/108191)
- [Research Computing Documentation, University of South Florida](https://wiki.rc.usf.edu/index.php/Main_Page) (involving settings for specific softwares)
- [Exercise: running python in the cluster](https://dccn-hpc-wiki.readthedocs.io/en/latest/docs/cluster_howto/exercise_python/exercise.html)
- How to run graphical user interface on Windows? (1) Have a SSH client, e.g. Linux subsystem. (2) Install and open [Xming](http://www.straightrunning.com/XmingNotes/). (3) Enter in BASH `export DISPLAY=localhost:0.0`. (4) Connect cluster through `ssh -X user@nots.rice.edu`. (5) Try `xterm` to see if there is a window opening. If yes, then congratulations!

#### MPI

- Blaise Barney, [Message Passing Interface (MPI)](https://computing.llnl.gov/tutorials/mpi/)
- William Gropp, [Tutorial on MPI: The Message-Passing Interface](https://www.mcs.anl.gov/research/projects/mpi/tutorial/gropp/talk.html)



### Advanced scientific programs/examples

- [Mpmath, for real and complex floating-point arithmetic with arbitrary precision](http://mpmath.org/). (Python)
- [LATTICEEASY](http://www.felderbooks.com/latticeeasy/), for lattice simulations of the evolution of interacting scalar fields in an expanding universe. (C/C++)
- [CAMB](https://camb.info/) (Code for Anisotropies in the Microwave Background). There is also a [web interface](https://lambda.gsfc.nasa.gov/toolbox/tb_camb_form.cfm) for it. (Python/Fortran)



### LaTeX

Tutorial

- [Wikibooks: LaTeX](https://en.wikibooks.org/wiki/LaTeX) and [LaTeX Guide](http://www.cs.princeton.edu/courses/archive/spr10/cos433/Latex/latex-guide.pdf)
- Using templates, e.g. [REVTeX](https://journals.aps.org/revtex/revtex-faq) (`sudo apt-get install texlive-publishers`), [LaTeX Templates](http://www.latextemplates.com/) and [ShareLaTeX](https://www.sharelatex.com/templates/).

Install LaTeX on Windows

1. Download MiKTeX on the [official website](http://www.latex-project.org/get/).
2. Install [TeXstudio](http://texstudio.sourceforge.net/) to write Latex codes.
3. To set dark theme of TeXstudio on windows, download “[texstudio_dark_theme.zip](texstudio_dark_theme.zip)“.

Install LaTeX on Ubuntu

1. `sudo apt-get update`
2. `sudo apt-get install texlive`
3. `sudo apt-get install texstudio`

You can replace "texlive" by one of the following commands (click [here](https://linuxconfig.org/how-to-install-latex-on-ubuntu-18-04-bionic-beaver-linux) for details)

- texlive-base – 136 MB
- texlive-latex-recommended – 177 MB
- texlive – 240 MB
- texlive-latex-extra – 404 MB
- texlive-full – 4714 MB
