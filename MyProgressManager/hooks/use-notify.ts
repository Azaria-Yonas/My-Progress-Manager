




import { useEffect, useRef } from "react";
import { NotifyService, NotifyTable } from "../services/notify";

export function useNotify(tables: NotifyTable[], onChange: () => void) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const key = tables.join(",");

  useEffect(() => {
    const watched = key.split(",");

    return NotifyService.subscribe((table) => {
      if (watched.includes(table)) onChangeRef.current();
    });
  }, [key]); 
}


