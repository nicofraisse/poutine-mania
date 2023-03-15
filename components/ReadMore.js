import React, { useState } from "react";

const ReadMore = ({ text, breakpoint = 1 }) => {
  const [state, setState] = useState("less");

  if (!text) {
    return null;
  }

  const firstChunk = text.split(" ").slice(0, breakpoint).join(" ");
  const lastChunk = text.split(" ").slice(breakpoint).join(" ");
  if (firstChunk)
    return (
      <p>
        {`"...${text}..."`}
        <span
          className="underline cursor-pointer hover:opacity-50 ml-1"
          onClick={() => setState("more")}
        >
          Lire la suite
        </span>
      </p>
    );

  if (text.split(" ").length < breakpoint) return <p>{text}</p>;

  return (
    <p>
      {firstChunk}
      {state === "less" && "..."}{" "}
      {state === "less" && (
        <span
          className="underline cursor-pointer hover:opacity-50"
          onClick={() => setState("more")}
        >
          Lire la suite
        </span>
      )}
      {state === "more" && (
        <>
          {lastChunk}{" "}
          <span
            className="underline cursor-pointer hover:opacity-50"
            onClick={() => setState("less")}
          >
            Voir moins
          </span>
        </>
      )}
    </p>
  );
};

export default ReadMore;
