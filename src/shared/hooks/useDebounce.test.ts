import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('Móc trì hoãn giá trị', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('chỉ cập nhật giá trị sau khi hết thời gian chờ', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'ban đầu' } },
    )

    rerender({ value: 'đã đổi' })
    expect(result.current).toBe('ban đầu')

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('ban đầu')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('đã đổi')
  })
})
