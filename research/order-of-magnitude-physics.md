---
layout: page
title: Order of magnitude physics
permalink: /research/order-of-magnitude-physics/
---

Can you imagine that many hard questions can actually be answered with a few sketches? Do you know that many of your “useless" knowledge can actually help solve big puzzles? In my view, order of magnitude physics should be served as a fundamental course for every physics student. With a few principles, one can miraculously understand within a few minutes those truths that took many great scientists countless efforts to figure out. In fact, one is often advised in research that

&nbsp;
> "Never calculate without first knowing the answer." -- John A. Wheeler

&nbsp;

To get a taste of this fantastic topic, you can go through [Guesstimation](https://press.princeton.edu/books/paperback/9780691129495/guesstimation) and [Guesstimation 2.0](https://press.princeton.edu/books/paperback/9780691150802/guesstimation-20). A more advanced lecture note on order of magnitude physics can be found [here](http://www.inference.org.uk/sanjoy/oom/book-letter.pdf), or a simplified version [here](https://web.stanford.edu/class/ee353/SanjoyMahajanIntro-01-1.pdf). If you need some references for constants, check the PDG document for [physical](https://pdg.lbl.gov/2023/web/viewer.html?file=../reviews/rpp2022-rev-phys-constants.pdf) and [astrophysical](https://pdg.lbl.gov/2023/web/viewer.html?file=../reviews/rpp2022-rev-astrophysical-constants.pdf) constants.

In the following, I list some important scales in physics and astrophysics for future reference. Regarding mathematical symbols for equivalence, I will follow the conventions: 
- "$a\approx b$" means that $a$ and $b$ are equal up to the 4/5 rounding rule for the last digit. Examples: $3.14\approx 3$, $1.55\approx 1.6$.
- "$a\sim b$" means that $a$ and $b$ are equal within an order of magnitude, i.e. a factor of $10$, while I will try to minimize the error within a factor of $3$. For example, both $4\times 10^3 \mathrm{m} \sim 10^3\mathrm{m}$ and $4\times 10^3 \mathrm{m} \sim 10^4\mathrm{m}$ are correct, but I prefer the latter. Also note that if I write something like $a\sim b\sim c\sim d$, I mean that all $a,b,c,d$ are equal within an order of magnitude -- the error should not be amplified.
- "$a\simeq b$" means that $a$ and $b$ are equal up to a factor of $\sqrt{10}\approx 3.16$. 
- "$a\propto b$" means that $a$ is proportional to $b$, while the value of them may differ a lot or even do not have the same dimension. For example, time=distance/speed, we may write $t\propto s$.


### Order of magnitudes

- Units:
  - $\hbar c \simeq 0.2 ~\mathrm{GeV ~fm}$.
  - $1~\mathrm{yr} \simeq \pi\times 10^7 ~\mathrm{s}$.
  - $1~\mathrm{pc} \simeq 3~\mathrm{lyr} \simeq 3\times 10^{16}\mathrm{m}$.

- Particles: 
  - $m_\mathrm{proton} \simeq m_\mathrm{neutron} \simeq 2000~m_\mathrm{electron} \simeq 1 ~\mathrm{GeV} \simeq 10^{-27} \mathrm{kg}$.
  - $r_\mathrm{c,proton} = \frac{2\pi}{m_\mathrm{proton}} \simeq 1~\mathrm{fm}$.

- Stars and planets:
  - $M_\odot \simeq 10^3 M_\mathrm{jupiter} \simeq 3\times 10^5 M_\oplus \simeq 3\times 10^7 M_\mathrm{moon} \simeq 10^{57} \mathrm{GeV}$.
  - $R_\odot/c \simeq 100~R_\oplus/c \simeq 2 ~\mathrm{s}$.
  - $R_\mathrm{s,\odot} = \frac{2GM_\odot}{c^2} \simeq 3 ~\mathrm{km}$; $R_\mathrm{s,\oplus} = \frac{2GM_\oplus}{c^2} \simeq 1 ~\mathrm{cm}$.
  - Distance between the sun and the earth is $\simeq$ 8 light minutes; distance between the earth and the moon is $\simeq$ 1 light second.

- Compact objects:
  - $M_\mathrm{M87}\sim 10^9 M_\odot$; $M_\mathrm{MilkyWay}\sim 10^6M_\odot$.

- Milky Way galaxy:
  - $M_\mathrm{Milky Way}\sim 10^{12}M_\odot$; $N_\mathrm{stars}\sim 10^{11}$
  - Distance between the sun and galaxy center $r_\odot \sim 8~\mathrm{kpc}$; NFW profile scale radius $r_s\sim 20 ~\mathrm{kpc}$.

- The observable universe:
  - Critical density $\rho_\mathrm{crit} \simeq 10^{-29}\mathrm{g/cm^3} \simeq 5~\mathrm{protons/m^3} \simeq 10^{11} M_\odot/\mathrm{Mpc^{-3}}$
  - Hubble parameter $H_0\simeq 10^{-33}~\mathrm{eV}$, $H_0^{-1} \simeq 10^{10} \mathrm{yr} \simeq 10^{10} \mathrm{ly} \simeq 5000 \mathrm{Mpc}$.
  - Matter-radiation equality $k_\mathrm{eq}\simeq 0.01 \mathrm{Mpc^{-1}}$, $H_{eq}\simeq 10^{-28} \mathrm{eV}$.

- Dark matter
  - $\rho_c \simeq 1 ~\mathrm{GeV/m^3}\simeq 8\times 10^{-48} ~\mathrm{GeV^4}$.
  - $\rho_\mathrm{local} \simeq 0.4 ~\mathrm{GeV/cm^3} \simeq 3\times 10^{-42} \mathrm{GeV^4}$.

### Conversion table for natural units

<figure>
  <p align="center" width="100%">
    <img src="{{site.url}}/research/figs/unit-conversion.png" alt="Picture" width="700">        
  </p>
</figure>

### Electromagnetic spectrum

<figure>
  <p align="center" width="100%">
    <img src="{{site.url}}/research/figs/em-spectrum.png" alt="Picture" width="700">        
  </p>
</figure>

### US units

The units in US are a little bit confusing (at least for me for a long time).
- Length: $1~\mathrm{mile}\approx 1.6~\mathrm{km}$; $1~\mathrm{feet} \approx 0.3~\mathrm{m}$; $1~\mathrm{inch} = 2.54~\mathrm{cm}$.
- Volume: $1~\mathrm{gal} \approx 3.8~\mathrm{L}$; $1~\mathrm{fl~oz} \approx 30~\mathrm{ml}$.
- Weight: $1~\mathrm{lb} \approx 0.45~\mathrm{kg}$; $1~\mathrm{oz}\approx 28~\mathrm{g}$.
- Temperature: $[\mathrm{^\circ C}] = \frac{5}{9}([\mathrm{^\circ F}]-32)$. $32~\mathrm{^\circ F} = 0~\mathrm{^\circ C}$; $77~\mathrm{^\circ F} = 25~\mathrm{^\circ C}$; $212~\mathrm{^\circ F} = 100~\mathrm{^\circ C}$.