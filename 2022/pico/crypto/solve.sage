import hashlib
import functools

ITERS = int(2e7)
VERIF_KEY = "96cc5f3b460732b442814fd33cf8537c"
ENCRYPTED_FLAG = bytes.fromhex("42cbbce1487b443de1acf4834baed794f4bbd0dfb78a053d258da7c42b")

# This will overflow the stack, it will need to be significantly optimized in order to get the answer :)
@functools.cache
def m_func(i):
    pp1 = 1612 * pow(-21, i)
    pp2 = 30685 * pow(2, 2*i+5) * pow(3, i)
    pp3 = 1082829 * pow(13, i)
    pp4 = 8349 * pow(17, i+1)
    result1 = (pp1 + pp2 - pp3 + pp4)/42636
    return result1
    # if i == 0: return 1
    # if i == 1: return 2
    # if i == 2: return 3
    # if i == 3: return 4

    # return 55692*m_func(i-4) - 9549*m_func(i-3) + 301*m_func(i-2) + 21*m_func(i-1)


# Decrypt the flag
def decrypt_flag(sol):
    sol = sol % (10**10000)
    sol = str(sol)
    sol_md5 = hashlib.md5(sol.encode()).hexdigest()

    if sol_md5 != VERIF_KEY:
        print("Incorrect solution")
        sys.exit(1)

    key = hashlib.sha256(sol.encode()).digest()
    print(key)
    flag = bytearray([char ^^ key[i] for i, char in enumerate(ENCRYPTED_FLAG)]).decode()

    print(flag)

if __name__ == "__main__":
    sol = m_func(ITERS)
    decrypt_flag(sol)
