let blocked = false
let timer: ReturnType<typeof setTimeout> | null = null

export function blockSceneClicksBriefly(ms = 120) {
  blocked = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    blocked = false
    timer = null
  }, ms)
}

export function shouldBlockSceneClick() {
  return blocked
}
