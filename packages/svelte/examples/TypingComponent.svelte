<script>
  import { onMount, onDestroy } from 'svelte';
  import { ultratyped } from '@ultratyped/svelte';
  import UltraTyped from 'ultratyped';

  export let strings = [
    'Welcome to UltraTyped.js Svelte!',
    'Modern reactive framework',
    'Clean component syntax',
    'Excellent performance'
  ];
  export let typeSpeed = 50;
  export let loop = true;
  export let showCursor = true;
  export let cursorChar = '|';

  let element;
  let instance = null;
  let status = 'Ready to start';
  let isRunning = false;
  let isPaused = false;

  // Initialize UltraTyped on mount
  onMount(() => {
    if (element) {
      instance = UltraTyped(element, {
        strings,
        typeSpeed,
        backSpeed: 30,
        backDelay: 1000,
        loop,
        showCursor,
        cursorChar,

        onBegin: () => {
          isRunning = true;
          isPaused = false;
          status = 'Animation began';
        },
        onComplete: () => {
          status = 'All strings completed!';
        },
        onStringTyped: (arrayPos, self) => {
          status = `Finished typing string ${arrayPos + 1}`;
        },
        onTypingPaused: () => {
          isPaused = true;
          status = 'Animation paused';
        },
        onTypingResumed: () => {
          isPaused = false;
          status = 'Animation resumed';
        },
        onStop: () => {
          isRunning = false;
          isPaused = false;
          status = 'Animation stopped';
        },
        onDestroy: () => {
          isRunning = false;
          isPaused = false;
          status = 'Animation destroyed';
        }
      });
    }
  });

  // Cleanup on destroy
  onDestroy(() => {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  });

  // Update instance when props change
  $: if (instance && strings) {
    instance.strings = strings;
    instance.reset();
  }

  $: if (instance && typeSpeed !== undefined) {
    instance.typeSpeed = typeSpeed;
  }

  $: if (instance && loop !== undefined) {
    instance.loop = loop;
  }

  $: if (instance && showCursor !== undefined) {
    instance.showCursor = showCursor;
  }

  $: if (instance && cursorChar !== undefined) {
    instance.cursorChar = cursorChar;
  }

  // Control methods
  function start() {
    if (instance) {
      instance.start();
    }
  }

  function pause() {
    if (instance) {
      instance.pause();
    }
  }

  function resume() {
    if (instance) {
      instance.resume();
    }
  }

  function reset() {
    if (instance) {
      instance.reset();
    }
  }

  function stop() {
    if (instance) {
      instance.stop();
    }
  }

  function destroy() {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  }

  // Helper for textarea binding
  let stringsText = '';

  // Update stringsText when strings change
  $: stringsText = strings ? strings.join('\n') : '';

  // Dynamic string management
  function addString() {
    strings = [...strings, `New string #${strings.length + 1}`];
  }

  function removeString() {
    if (strings.length > 1) {
      strings = strings.slice(0, -1);
    }
  }

  function shuffleStrings() {
    strings = [...strings].sort(() => Math.random() - 0.5);
  }
</script>

<div class="typing-component">
  <div class="typed-element" bind:this={element}></div>

  <div class="controls">
    <button on:click={start} disabled={isRunning}>Start</button>
    <button on:click={pause} disabled={!isRunning || isPaused}>Pause</button>
    <button on:click={resume} disabled={!isRunning || !isPaused}>Resume</button>
    <button on:click={reset}>Reset</button>
    <button on:click={stop}>Stop</button>
    <button on:click={destroy}>Destroy</button>
  </div>

  <div class="status">{status}</div>

  <div class="props-editor">
    <div class="input-group">
      <label for="strings">Strings (one per line):</label>
      <textarea
        id="strings"
        bind:value={stringsText}
        on:input={() => {
          strings = stringsText.split('\n').filter(s => s.trim());
        }}
        placeholder="Enter strings to type, one per line..."
      ></textarea>
    </div>

    <div class="input-group">
      <label for="typeSpeed">Type Speed (ms):</label>
      <input
        id="typeSpeed"
        type="number"
        bind:value={typeSpeed}
        min="10"
        max="200"
      />
    </div>

    <div class="input-group">
      <label>
        <input type="checkbox" bind:checked={loop} />
        Loop
      </label>
    </div>

    <div class="input-group">
      <label>
        <input type="checkbox" bind:checked={showCursor} />
        Show Cursor
      </label>
    </div>

    <div class="input-group">
      <label for="cursorChar">Cursor Char:</label>
      <input
        id="cursorChar"
        type="text"
        bind:value={cursorChar}
        maxlength="5"
      />
    </div>
  </div>

  <div class="string-controls">
    <button on:click={addString}>Add String</button>
    <button on:click={removeString}>Remove Last</button>
    <button on:click={shuffleStrings}>Shuffle</button>
  </div>

  <div class="string-list">
    <p>Current strings ({strings.length}):</p>
    <ul>
      {#each strings as str, index}
        <li>{index + 1}. {str}</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .typing-component {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .typed-element {
    font-size: 24px;
    color: #2563eb;
    min-height: 40px;
    margin: 20px 0;
    font-family: 'Courier New', monospace;
  }

  .controls {
    display: flex;
    gap: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #2563eb;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #1d4ed8;
  }

  button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  .status {
    padding: 10px;
    background-color: #f3f4f6;
    border-radius: 5px;
    margin: 10px 0;
    font-size: 14px;
  }

  .props-editor {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin: 20px 0;
  }

  .input-group {
    display: flex;
    flex-direction: column;
  }

  .input-group.full-width {
    grid-column: 1 / -1;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #374151;
  }

  input, select, textarea {
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
  }

  textarea {
    height: 80px;
    resize: vertical;
  }

  input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
  }

  .string-controls {
    display: flex;
    gap: 10px;
    margin: 15px 0;
  }

  .string-list {
    margin: 15px 0;
    padding: 15px;
    background-color: #f9fafb;
    border-radius: 5px;
  }

  .string-list ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  .string-list li {
    margin: 5px 0;
    font-family: 'Courier New', monospace;
  }

  @media (max-width: 768px) {
    .props-editor {
      grid-template-columns: 1fr;
    }

    .controls {
      flex-direction: column;
    }

    .string-controls {
      flex-direction: column;
    }
  }
</style>

<script context="module">
  // Helper to convert strings array to textarea format
  $: stringsText = strings ? strings.join('\n') : '';
</script>
