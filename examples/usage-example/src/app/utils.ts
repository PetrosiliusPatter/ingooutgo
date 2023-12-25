export const formatMs = (ms: number) => {
  // Formats milliseconds as minutes:seconds:milliseconds
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = Math.floor(ms % 1000)
  const out = `${minutes}:${String(seconds).padStart(2, '0')}:${String(
    milliseconds
  ).padStart(3, '0')}`
  return out
}

export const urlWithBasePath = (url: string) =>
  `${process.env.DB_HOST ?? '.'}/${url}`
