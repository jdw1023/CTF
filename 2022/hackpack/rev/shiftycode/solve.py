import angr,sys
import claripy


flag_chars = [claripy.BVS('flag_%d' % i, 8) for i in range(39)]

flag = claripy.Concat(*flag_chars + [claripy.BVV(b'\n')])

proj = angr.Project('./shiftycode', auto_load_libs=False)
filename = './bin'
simfile = angr.SimFile(filename, content=open(filename, 'rb').read())
init_state = proj.factory.entry_state(args=['./shiftycode', filename], fs={filename: simfile}, stdin=flag, add_options={angr.options.ZERO_FILL_UNCONSTRAINED_MEMORY})
for k in flag_chars:
    init_state.solver.add(k >= 0x20)
    init_state.solver.add(k <= 0x7f)

simulation = proj.factory.simgr(init_state)

simulation.explore(find=lambda s: b'flag' in s.posix.dumps(sys.stdout.fileno()))
for pp in simulation.found:
    print(pp.posix.dumps(sys.stdin.fileno()))
    print(pp.posix.dumps(sys.stdout.fileno()))
