import {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";

export type EventType = keyof GlobalEventHandlersEventMap | string;

type LogId = `${string}-${string}-${string}-${string}-${string}`;

export interface NarcEventData<T> {
  eventType: EventType;
  eventData: T | any;
}

interface NarcEventLog<T> extends NarcEventData<T> {
  id: LogId;
  date: Date;
}

type NarcEventLogs<T> = Array<NarcEventLog<T>>;

type EventNarcContextType<T> =
  | {
      addToNarcLog: (data: NarcEventData<T>) => void;
    }
  | undefined;

type FormattedEventLogs = Array<any>;

interface EventNarcProps {
  children: React.ReactNode;
  informOn?: Array<EventType> | ((data: NarcEventData<any>) => boolean);
  informTo?: (
    data: NarcEventLogs<any> | FormattedEventLogs
  ) => void | undefined;
  onNewEventLog?: (log: NarcEventLog<any>, logs: NarcEventLogs<any>) => void;
  formatter?: (data: NarcEventLogs<any>) => FormattedEventLogs;
  onFilterFn?: (data: NarcEventLogs<any>) => NarcEventLogs<any>;
  onFilterEventTypes?: Array<EventType>;
  clearLogsAfterInforming?: boolean;
  clearLogsAfterMinutes?: number;
  clearLogsAfterNumberOfLogs?: number;
  maxLogCount?: number;
  mode?: "development" | "production" | string;
}

const EventNarcContext = createContext<EventNarcContextType<any>>(undefined);

export const EventNarc = ({
  children,
  informOn = [],
  informTo = undefined,
  onNewEventLog,
  formatter,
  onFilterFn,
  onFilterEventTypes,
  clearLogsAfterInforming = true,
  clearLogsAfterMinutes,
  clearLogsAfterNumberOfLogs,
  maxLogCount,
  mode = (process.env.NODE_ENV as string) || "development",
}: EventNarcProps) => {
  const [narcEventLogs, setNarcEventLogs] = useState<NarcEventLogs<any>>([]);

  const narcEventLogsRef = useRef(narcEventLogs);
  narcEventLogsRef.current = narcEventLogs;

  useEffect(() => {
    return () => {
      console.log("Unmounting EventNarc");
      // setNarcEventLogs([]);
    };
  }, []);

  useEffect(() => {
    if (narcEventLogs.length == 0) return;
    const lastLog = narcEventLogs[narcEventLogs.length - 1];
    if (mode != "production") {
      // console.log(`EventNarc Log #${narcEventLogs.length}: \n`, lastLog);
    }
    if (onNewEventLog) {
      onNewEventLog(lastLog, narcEventLogs);
    }

    if (
      informOn &&
      ((Array.isArray(informOn) && informOn.length > 0) ||
        typeof informOn === "function") &&
      !informTo
    ) {
      throw new Error("informTo is required when informOn is provided");
    }

    console.log("narcEventLogs", narcEventLogs);
  }, [informOn, narcEventLogs, mode, onNewEventLog]);

  useEffect(() => {
    if (clearLogsAfterMinutes) {
      const interval = setInterval(() => {
        setNarcEventLogs([]);
      }, clearLogsAfterMinutes * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [clearLogsAfterMinutes]);

  useEffect(() => {
    if (
      clearLogsAfterNumberOfLogs &&
      narcEventLogs.length > clearLogsAfterNumberOfLogs
    ) {
      setNarcEventLogs([]);
    }
  }, [clearLogsAfterNumberOfLogs, narcEventLogs]);

  useEffect(() => {
    if (maxLogCount && narcEventLogs.length > maxLogCount) {
      const logs = structuredClone(narcEventLogs);
      const logsToKeep = logs.slice(logs.length - maxLogCount);
      setNarcEventLogs(logsToKeep);
    }
  }, [maxLogCount, narcEventLogs]);

  const createLogItem = useCallback(
    (data: NarcEventData<any>): NarcEventLog<any> => ({
      id: crypto.randomUUID(),
      date: new Date(),
      eventType: data.eventType,
      eventData: data.eventData,
    }),
    []
  );

  const addToNarcLog = useCallback(
    (data: NarcEventData<any>) => {
      if (shouldNarcInform(data)) {
        informingFn([...narcEventLogsRef.current, createLogItem(data)]);
      } else {
        setNarcEventLogs((prevState) => {
          const newLogItem = createLogItem(data);
          return [...prevState, newLogItem];
        });
      }
    },
    [informOn]
  );

  const informingFn = useCallback(
    (data: NarcEventLogs<any>) => {
      if (!informTo) return;

      let trackedData = data;
      if (onFilterFn) {
        trackedData = onFilterFn(trackedData);
      }
      if (onFilterEventTypes) {
        trackedData = trackedData.filter((d) =>
          onFilterEventTypes.includes(d.eventType)
        );
      }
      if (formatter) {
        trackedData = formatter(trackedData);
      }

      informTo(trackedData);

      if (clearLogsAfterInforming) {
        setNarcEventLogs([]);
      }
    },
    [
      informTo,
      onFilterFn,
      onFilterEventTypes,
      formatter,
      clearLogsAfterInforming,
    ]
  );

  const shouldNarcInform = useCallback(
    (data: NarcEventData<any>) => {
      if (informOn && Array.isArray(informOn) && informOn.length > 0) {
        return informOn.includes(data.eventType);
      } else if (informOn && typeof informOn === "function") {
        return informOn(data);
      }
      return false;
    },
    [informOn]
  );

  const contextValue = useMemo(
    () => ({
      addToNarcLog,
    }),
    [addToNarcLog]
  );

  return (
    <EventNarcContext.Provider value={contextValue}>
      {children}
    </EventNarcContext.Provider>
  );
};

export const useEventNarc = () => {
  const context = useContext(EventNarcContext);
  if (!context) {
    throw new Error("useEventNarc must be used within a EventNarc Component");
  }
  return context;
};
