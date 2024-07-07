const BETWEEN_CURLY_REGEX =
  /\{([^}{]+)\}/g

export const url_param_replacer =
  (
    url: string,
    params: Record<
      string,
      string
    >,
  ) => {
    return url.replace(
      BETWEEN_CURLY_REGEX,
      match => {
        const key =
          match.slice(1, -1)
        return (
          params[key] || match
        )
      },
    )
  }
