import { useEffect } from "react";
import { EventType, useEventNarc } from "./EventNarc";

type InformOnDataEventsProps<T> = {
  eventType?: EventType;
  eventData?: T | any;
};

export const InformOnDataEvents = <T,>({
  eventType,
  eventData,
}: InformOnDataEventsProps<T>): null => {
  const { addToNarcLog } = useEventNarc();

  useEffect(() => {
    if (!eventType || !eventData) return;
    addToNarcLog({ eventType, eventData });
  }, [eventType, eventData]);

  return null;
};
