const VARIANTS = {
  primary:
    'bg-blue-600 hover:bg-blue-700 text-white shadow-glossy',
  emerald:
    'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]',
  ghost:
    'bg-white/10 hover:bg-white/20 text-white border border-white/20',
  outline:
    'bg-transparent border border-gray-400/50 hover:bg-white/10 text-gray-200',
}

const Button = ({
  as = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const Tag = as
  return (
    <Tag
      className={`btn-glossy cursor-pointer active:scale-95 inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-6 py-3 text-sm transition ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Button
