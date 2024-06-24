export const update_user_info = <T = any>(data?: T) => {
  if (!data) {
    localStorage.removeItem('xstore/user')
  } else {
    localStorage.setItem(
      'xstore/user',
      JSON.stringify(data),
    )
  }
}

export const get_user_info = <T = any>() => {
  try {
    const data = localStorage.getItem('xstore/user')
    if (!data) return

    return JSON.parse(data) as Partial<T>
  } catch (err) {
    console.error(err)
  }
}
