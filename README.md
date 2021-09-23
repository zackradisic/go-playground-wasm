# Go Playground WASM

This is an experiment in trying to make a version of play.golang.org that runs completely in the browser by 
compiling [goscript](https://github.com/oxfeeefeee/goscript) (by [oxfeeefeee](https://github.com/oxfeeefeee)) to WASM.

Most of Go's language features are supported, notably channels/goroutines/select.


### Disclaimer
goscript only makes guarantees that the syntax will be identical to Go's, there are implementation details that will cause discrepancies from running actual Go code with the actual Go compiler.


