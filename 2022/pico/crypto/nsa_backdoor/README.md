```sage
#!/usr/bin/env sage

from Crypto.Util.number import long_to_bytes
print('input pq: ')
pq = int(input())
print('input c: ')
c = int(input())
n = factorial(100000)
q = gcd(pow(2,n,pq)-1, pq) # Pollard’s p − 1 Factorization Algorithm
p=Integer(pq)/Integer(q)
print('p: ', p)
print('q: ', q)
assert Integer(q)*Integer(p)==pq
R=IntegerModRing(p)
g=3
x=discrete_log(R(c), R(g))
print(long_to_bytes(int(x)))
```
