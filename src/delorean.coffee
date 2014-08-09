# Exporting flux as `DeLorean.Flux`
# This file is the entry point of the library.
DeLorean =
  Flux: require './flux.coffee'

if window?
  window.DeLorean = DeLorean
