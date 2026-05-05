import React, { useState, useEffect, useRef, useCallback } from "react";
import { useUltraTyped as useUltraTypedHook } from "@ultratyped/react";
import UltraTyped from "ultratyped";

// Basic typing component
const TypingComponent: React.FC = () => {
  const [status, setStatus] = useState("Ready to start");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [strings, setStrings] = useState([
    "Welcome to UltraTyped.js React!",
    "Modern React integration",
    "Hooks-based approach",
    "Proper cleanup patterns",
  ]);
  const [typeSpeed, setTypeSpeed] = useState(50);
  const [loop, setLoop] = useState(true);

  const typedRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  // Initialize UltraTyped instance
  useEffect(() => {
    if (typedRef.current && !instanceRef.current) {
      instanceRef.current = UltraTyped(typedRef.current, {
        strings,
        typeSpeed,
        backSpeed: 30,
        backDelay: 1000,
        loop,
        showCursor: true,
        cursorChar: "|",

        onBegin: () => {
          setIsRunning(true);
          setIsPaused(false);
          setStatus("Animation began");
        },
        onComplete: () => {
          setStatus("All strings completed!");
        },
        onStringTyped: (arrayPos: number) => {
          setStatus(`Finished typing string ${arrayPos + 1}`);
        },
        onTypingPaused: () => {
          setIsPaused(true);
          setStatus("Animation paused");
        },
        onTypingResumed: () => {
          setIsPaused(false);
          setStatus("Animation resumed");
        },
        onStop: () => {
          setIsRunning(false);
          setIsPaused(false);
          setStatus("Animation stopped");
        },
        onDestroy: () => {
          setIsRunning(false);
          setIsPaused(false);
          setStatus("Animation destroyed");
        },
      });
    }

    // Cleanup function
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  // Update configuration when state changes
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.strings = strings;
      instanceRef.current.typeSpeed = typeSpeed;
      instanceRef.current.loop = loop;
    }
  }, [strings, typeSpeed, loop]);

  const start = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.start();
    }
  }, []);

  const pause = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.resume();
    }
  }, []);

  const reset = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.reset();
    }
  }, []);

  const stop = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.stop();
    }
  }, []);

  const destroy = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }
  }, []);

  const addString = useCallback(() => {
    setStrings((prev) => [...prev, `New string #${prev.length + 1}`]);
  }, []);

  const removeString = useCallback(() => {
    setStrings((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "15px",
          color: "#374151",
        }}
      >
        Basic React Component
      </h3>

      <div
        ref={typedRef}
        style={{
          fontSize: "24px",
          color: "#2563eb",
          minHeight: "40px",
          margin: "20px 0",
          fontFamily: "Courier New, monospace",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
          flexWrap: "wrap",
        }}
      >
        <button onClick={start} disabled={isRunning} style={buttonStyle}>
          Start
        </button>
        <button
          onClick={pause}
          disabled={!isRunning || isPaused}
          style={buttonStyle}
        >
          Pause
        </button>
        <button
          onClick={resume}
          disabled={!isRunning || !isPaused}
          style={buttonStyle}
        >
          Resume
        </button>
        <button onClick={reset} style={buttonStyle}>
          Reset
        </button>
        <button onClick={stop} style={buttonStyle}>
          Stop
        </button>
        <button onClick={destroy} style={buttonStyle}>
          Destroy
        </button>
      </div>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#f3f4f6",
          borderRadius: "5px",
          margin: "10px 0",
          fontSize: "14px",
        }}
      >
        {status}
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          margin: "15px 0",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1", minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#374151",
            }}
          >
            Strings:
          </label>
          <textarea
            value={strings.join("\n")}
            onChange={(e) =>
              setStrings(e.target.value.split("\n").filter((s) => s.trim()))
            }
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
              height: "80px",
              resize: "vertical",
            }}
            placeholder="Enter strings to type, one per line..."
          />
        </div>

        <div style={{ flex: "1", minWidth: "150px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#374151",
            }}
          >
            Type Speed (ms):
          </label>
          <input
            type="number"
            value={typeSpeed}
            onChange={(e) => setTypeSpeed(Number(e.target.value))}
            min="10"
            max="200"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ flex: "1", minWidth: "100px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#374151",
            }}
          >
            Loop:
          </label>
          <select
            value={loop}
            onChange={(e) => setLoop(e.target.value === "true")}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
        <button onClick={addString} style={buttonStyle}>
          Add String
        </button>
        <button onClick={removeString} style={buttonStyle}>
          Remove Last
        </button>
      </div>
    </div>
  );
};

// Custom hook for UltraTyped
const useUltraTypedCustom = (
  element: React.RefObject<HTMLElement>,
  options: any,
) => {
  const instanceRef = useRef<any>(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (element.current && !instanceRef.current) {
      instanceRef.current = UltraTyped(element.current, {
        ...options,
        onBegin: () => {
          setStatus("running");
          options.onBegin?.();
        },
        onComplete: () => {
          setStatus("completed");
          options.onComplete?.();
        },
        onStop: () => {
          setStatus("stopped");
          options.onStop?.();
        },
        onDestroy: () => {
          setStatus("destroyed");
          options.onDestroy?.();
        },
      });
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [element, options]);

  const controls = {
    start: () => instanceRef.current?.start(),
    pause: () => instanceRef.current?.pause(),
    resume: () => instanceRef.current?.resume(),
    reset: () => instanceRef.current?.reset(),
    stop: () => instanceRef.current?.stop(),
    destroy: () => instanceRef.current?.destroy(),
  };

  return { status, controls };
};

// Hook-based component
const HookBasedComponent: React.FC = () => {
  const typedRef = useRef<HTMLDivElement>(null);
  const [strings, setStrings] = useState([
    "Custom hook approach",
    "Cleaner component code",
    "Reusable logic",
    "TypeScript support",
  ]);

  const { status, controls } = useUltraTypedCustom(typedRef, {
    strings,
    typeSpeed: 45,
    backSpeed: 25,
    loop: true,
    showCursor: true,
    cursorChar: "▋",
  });

  useEffect(() => {
    // Update strings when they change
    if (typedRef.current) {
      const instance = (typedRef.current as any)._ultraTyped;
      if (instance) {
        instance.strings = strings;
        instance.reset();
      }
    }
  }, [strings]);

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "15px",
          color: "#374151",
        }}
      >
        Custom Hook Component
      </h3>

      <div
        ref={typedRef}
        style={{
          fontSize: "24px",
          color: "#16a34a",
          minHeight: "40px",
          margin: "20px 0",
          fontFamily: "Courier New, monospace",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => controls.start()} style={buttonStyle}>
          Start
        </button>
        <button onClick={() => controls.pause()} style={buttonStyle}>
          Pause
        </button>
        <button onClick={() => controls.resume()} style={buttonStyle}>
          Resume
        </button>
        <button onClick={() => controls.reset()} style={buttonStyle}>
          Reset
        </button>
        <button onClick={() => controls.stop()} style={buttonStyle}>
          Stop
        </button>
      </div>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#f3f4f6",
          borderRadius: "5px",
          margin: "10px 0",
          fontSize: "14px",
        }}
      >
        Status: {status}
      </div>

      <div style={{ margin: "15px 0" }}>
        <button
          onClick={() =>
            setStrings((prev) => [...prev, `Hook string #${prev.length + 1}`])
          }
          style={buttonStyle}
        >
          Add String
        </button>
      </div>
    </div>
  );
};

// Multiple instances component
const MultipleInstancesComponent: React.FC = () => {
  const instancesRef = useRef<(any | null)[]>([null, null, null]);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useEffect(() => {
    // Initialize all instances
    instancesRef.current = elementsRef.current.map((element, index) => {
      if (element) {
        return UltraTyped(element, {
          strings: [
            `Instance ${index + 1} - String 1`,
            `Instance ${index + 1} - String 2`,
            `Instance ${index + 1} - String 3`,
          ],
          typeSpeed: 40 + index * 10,
          backSpeed: 20 + index * 5,
          loop: true,
          showCursor: true,
          cursorChar: ["▋", "▌", "▐"][index],
        });
      }
      return null;
    });

    // Cleanup all instances
    return () => {
      instancesRef.current.forEach((instance) => {
        if (instance) {
          instance.destroy();
        }
      });
      instancesRef.current = [null, null, null];
    };
  }, []);

  const startAll = () => {
    instancesRef.current.forEach((instance) => instance?.start());
  };

  const pauseAll = () => {
    instancesRef.current.forEach((instance) => instance?.pause());
  };

  const resumeAll = () => {
    instancesRef.current.forEach((instance) => instance?.resume());
  };

  const stopAll = () => {
    instancesRef.current.forEach((instance) => instance?.stop());
  };

  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "15px",
          color: "#374151",
        }}
      >
        Multiple Instances
      </h3>

      <div
        ref={(el) => (elementsRef.current[0] = el)}
        style={{
          fontSize: "24px",
          color: "#dc2626",
          minHeight: "40px",
          margin: "20px 0",
          fontFamily: "Courier New, monospace",
        }}
      />
      <div
        ref={(el) => (elementsRef.current[1] = el)}
        style={{
          fontSize: "24px",
          color: "#2563eb",
          minHeight: "40px",
          margin: "20px 0",
          fontFamily: "Courier New, monospace",
        }}
      />
      <div
        ref={(el) => (elementsRef.current[2] = el)}
        style={{
          fontSize: "24px",
          color: "#9333ea",
          minHeight: "40px",
          margin: "20px 0",
          fontFamily: "Courier New, monospace",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
          flexWrap: "wrap",
        }}
      >
        <button onClick={startAll} style={buttonStyle}>
          Start All
        </button>
        <button onClick={pauseAll} style={buttonStyle}>
          Pause All
        </button>
        <button onClick={resumeAll} style={buttonStyle}>
          Resume All
        </button>
        <button onClick={stopAll} style={buttonStyle}>
          Stop All
        </button>
      </div>
    </div>
  );
};

// Button style
const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  transition: "backgroundColor 0.2s",
};

// Main App component
const App: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ color: "#333", textAlign: "center", marginBottom: "30px" }}
        >
          UltraTyped.js - React Example
        </h1>

        <TypingComponent />
        <HookBasedComponent />
        <MultipleInstancesComponent />
      </div>
    </div>
  );
};

export default App;
