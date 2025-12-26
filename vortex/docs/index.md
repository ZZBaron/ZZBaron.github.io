+++
title = "Vortex"
hascode = true
date = Date(2025, 11, 13)
rss = "A short description of the page which would serve as **blurb** in a `RSS` feed; you can use basic markdown here but the whole description string must be a single line (not a multiline string). Like this one for instance. Keep in mind that styling is minimal in RSS so for instance don't expect maths or fancy styling to work; images should be ok though: ![](https://upload.wikimedia.org/wikipedia/en/3/32/Rick_and_Morty_opening_credits.jpeg)"

tags = ["syntax", "code", "image"]
repo_url = "https://github.com/ZZBaron/Vortex"
+++

# Vortex Engine

@@row
@@container
@@left ![](/assets/engine.mp4) @@
@@
~~~
<video width="100%" autoplay loop muted playsinline>
  <source src="/assets/engine.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
~~~
@@

## About
Vortex is a work in progress game engine using an entity component system architecture with a focus on physics simulations. It is written in C++, uses [Vulkan](https://www.vulkan.org/) for rendering, and is built with the [xmake](https://xmake.io/) build system.



    