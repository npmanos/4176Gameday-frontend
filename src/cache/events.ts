import { ProcessedEventInfo } from '@/api/event-info'
import { transaction } from '.'
import { getEvents } from '@/api/event-info/get-events'
import { getEventInfo } from '@/api/event-info/get-event-info'
import { useNetworkCache } from '@/utils/use-network-cache'
import { createPromiseRace } from '@/utils/fastest-promise'
import { preventEmptyArrResolve } from '@/utils/prevent-empty-arr-resolve'

const getCachedEvents = () =>
  transaction<ProcessedEventInfo[]>('events', eventStore =>
    eventStore.getAll(),
  ).then(preventEmptyArrResolve)

const getCachedEventInfo = (eventKey: string) =>
  transaction<ProcessedEventInfo>('events', eventStore =>
    eventStore.get(eventKey),
  )

export const getFastestEventInfo = createPromiseRace(
  getEventInfo,
  getCachedEventInfo,
)

export const useEventInfo = useNetworkCache(getEventInfo, getCachedEventInfo)

export const useEvents = useNetworkCache(getEvents, getCachedEvents)
