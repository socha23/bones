export const Icon = (p: {size: number, path: string}) => <div style={{
    width: p.size,
    height: p.size,
    backgroundImage: `url("${p.path}")`,
    backgroundSize: p.size,
  }}/>
