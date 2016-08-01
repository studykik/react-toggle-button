import expect from 'expect'

import fetchStudies from '../fetchStudies'
import { createTestingDispatch } from 'utils/testing'

describe('fetchStudies action creator', () => {
  it('searches with the current search parameters in the state', () => {
    const dispatch = createTestingDispatch()

    dispatch(fetchStudies({
      distance: 8000
    }))

    let [ started, searchEntities ] = dispatch.flattenAsyncActions(
      () => ({ })
    )

    const body = JSON.stringify(searchEntities.payload)

    expect(started).toEqual({
      status: 'started',
      type: 'FETCH_STUDIES',
    })

    expect(searchEntities.type).toEqual('EFFECT_COMPOSE')
    expect(searchEntities.payload.type).toEqual('EFFECT_FETCH')
    expect(searchEntities.payload.url).toEqual(`${API_URL}/studies?distance=8000`)
    expect(searchEntities.payload.url).toContain('distance=8000')
    expect(searchEntities.payload.params.method).toEqual('get')
    expect(searchEntities.payload.params.body).toEqual(null)

    expect(body).toContain('distance=8000')
  })
})