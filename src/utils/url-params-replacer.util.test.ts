import {
  it,
  describe,
  expect,
} from 'vitest'
import { url_param_replacer } from './url-params-replacer.util'

describe('url-params-replacer.util', () => {
  it('should replace url params', () => {
    const url =
      'https://api.com/{id}'
    const params = { id: '1' }
    const result =
      url_param_replacer(
        url,
        params,
      )
    expect(result).toBe(
      'https://api.com/1',
    )
  })

  it('should work with multiple params', () => {
    const url =
      'https://api.com/{id}/{name}'
    const params = {
      id: '1',
      name: 'john',
    }
    const result =
      url_param_replacer(
        url,
        params,
      )
    expect(result).toBe(
      'https://api.com/1/john',
    )
  })
})
