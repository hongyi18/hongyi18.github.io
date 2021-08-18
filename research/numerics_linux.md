---
layout: page
title: Cheat sheet for Linux commands
permalink: /research/numerics/linux
---
### Cheat sheet for Linux

- [Unix/Linux Command Cheat Sheet](https://files.fosswire.com/2007/08/fwunixref.pdf)

About softwares

- `sudo apt-get upgrade` (update the whole apt-get library)
- `sudo apt install build-essential` (install basic functions and dependencies)
- `sudo apt install xxx` (install the software of xxx)
- `sudo apt install -f` (fix the last installation)
- `sudo apt upgrade xxx` (upgrade the software of xxx)



### Cheat sheet for clusters at Rice

- [Documentation of NOTS at Rice](https://kb.rice.edu/108237)

Log in and copy files

- `ssh username@nots.rice.edu`
- `scp local_file.zip username@nots.rice.edu:`
- (1) `sftp username@nots.rice.edu` (2) `put local_file.zip` (3) `get remote_file.zip` (4) `put -r local_directory` (5) `get -r remote_directory`.

Check and load modules

- `module list` (current loaded modules in my environment)
- `module spider GCC` (available modules related to GCC)
- `module load GCC/9.3.0 OpenMPI/4.0.3 FFTW/3.3.8` (load related modules, e.g. GCC, OpenMPI and FFTW)
- `module save` (save the current environment)

Submit and monitoring jobs

- Write a slurm file, i.e. an example of [my slurm](myslurm).
- `sbatch myslurm` (submit the job)
- `watch squeue -u username` (check the job status)

How to run graphical applications, e.g. Mathematica?

1. Download and run [Xming](https://sourceforge.net/projects/xming/files/Xming/6.9.0.31/Xming-6-9-0-31-setup.exe/download).
2. To connect the current bash terminal to X11 server, type `export DISPLAY=localhost:0.0`.
3. Connect the cluster through `ssh -X username@nots.rice.edu`.
4. Type `xterm` to see if there is a window opened. If yes, then it works!
5. In order to run Mathematica, we need to reserve a compute node, say "scavenge", by using `srun --pty --x11 --export=ALL --partition scavenge --nodes=1 --ntasks-per-node=1 --cpus-per-task=20 --mem-per-cpu=1500M --time=00:40:00 $SHELL`. Here `--export==ALL` means exporting the same environment to the compute note.
6. See the [reference](https://kb.rice.edu/page.php?id=108433).

Data and quotas

- $Home: The home directory is where your sessions begin by default. Its intended use is for storing scripts, notes, final products (e.g. figures), etc. Home storage is backed up daily, so you may restore files by contacting the cluster managers. This directory should not be used for running jobs on the cluster.
- $PROJECTS: Project storage is intended for storing datasets and other files that are accessible by all members of the PI group. This directory should not be used for running jobs on the cluster.
- $WORK: This is the storage location for running jobs.
- $SHARED_SCRATCH: This directory is usually intended for reading or writing data required by jobs (job I/O) running on the cluster. It may also be used as a temporary location to hold files if you are over quota. Best practice dictates creating directory for yourself and working with files from inside of said directory.
- $TMPDIR: ???