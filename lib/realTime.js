import { useEffect } from "react";
import { supabase } from "@/lib/createClient";

export default function useParkingRealtime({ table, setData }) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-updates`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          setData((prev) => {
            if (payload.eventType === "INSERT") {
              return [...prev, payload.new];
            } else if (payload.eventType === "UPDATE") {
              return prev.map((user) =>
                user.id === payload.new.id ? payload.new : user
              );
            } else if (payload.eventType === "DELETE") {
              return prev.filter((user) => user.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, setData]);
}
