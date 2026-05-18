import autoprefixer from "autoprefixer"
import tailwindcss from "tailwindcss"

export default ({ file }) => {
  const skipTailwind = file && /[\\/]public[\\/]/.test(file)

  return {
    plugins: [
      !skipTailwind && tailwindcss(),
      autoprefixer(),
    ].filter(Boolean),
  }
}
