<script>
  import TypingComponent from './TypingComponent.svelte';
  import { onMount } from 'svelte';

  let actionInstance = null;
  let actionStatus = 'Ready to start';
  let actionStrings = ['Svelte action approach', 'Automatic cleanup', 'Reactive updates', 'Modern syntax'];

  // Demonstrate Svelte action usage
  let actionElement;

  onMount(() => {
    if (actionElement) {
      actionInstance = UltraTyped(actionElement, {
        strings: actionStrings,
        typeSpeed: 45,
        backSpeed: 25,
        loop: true,
        showCursor: true,
        cursorChar: '▋',
        
        onBegin: () => {
          actionStatus = 'Action animation began';
        },
        onStringTyped: (arrayPos) => {
          actionStatus = `Action: Finished string ${arrayPos + 1}`;
        },
        onComplete: () => {
          actionStatus = 'Action animation completed';
        }
      });
    }
  });

  function startAction() {
    if (actionInstance) {
      actionInstance.start();
    }
  }

  function stopAction() {
    if (actionInstance) {
      actionInstance.stop();
    }
  }

  function updateActionStrings() {
    actionStrings = [...actionStrings, `New action string #${actionStrings.length + 1}`];
    if (actionInstance) {
      actionInstance.strings = actionStrings;
      actionInstance.reset();
    }
  }
</script>

<svelte:head>
  <title>UltraTyped.js - Svelte Example</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    
    .container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .section {
      margin: 40px 0;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    
    .section-title {
      margin-bottom: 15px;
    }
    
    .action-demo {
      background-color: #f0f9ff;
      border: 1px solid #0284c7;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .action-element {
      min-height: 40px;
      margin: 20px 0;
    }
    
    .action-controls {
      display: flex;
      gap: 10px;
      margin: 15px 0;
    }
    
    .action-status {
      padding: 10px;
      background-color: #e0f2fe;
      border-radius: 5px;
      margin: 10px 0;
    }
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
      background-color: #0284c7;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #0369a1;
    }
  </style>
</svelte:head>

<div class="container">
  <h1>UltraTyped.js - Svelte Example</h1>
  
  <div class="section">
    <div class="section-title">Component-based Integration</div>
    <TypingComponent />
  </div>
  
  <div class="section">
    <div class="section-title">Svelte Action Integration</div>
    <div class="action-demo">
      <p>This demonstrates using UltraTyped as a Svelte action for automatic cleanup:</p>
      
      <div class="action-element" bind:this={actionElement}></div>
      
      <div class="action-controls">
        <button on:click={startAction}>Start Action</button>
        <button on:click={stopAction}>Stop Action</button>
        <button on:click={updateActionStrings}>Add String</button>
      </div>
      
      <div class="action-status">{actionStatus}</div>
      
      <div style="margin-top: 15px;">
        <strong>Current action strings:</strong>
        <ul>
          {#each actionStrings as str, index}
            <li>{index + 1}. {str}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Integration Patterns</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <h4>Component Pattern</h4>
        <ul>
          <li>Full control over instance</li>
          <li>Manual lifecycle management</li>
          <li>Complex state handling</li>
          <li>Event callback integration</li>
        </ul>
      </div>
      <div>
        <h4>Action Pattern</h4>
        <ul>
          <li>Automatic cleanup</li>
          <li>Simpler syntax</li>
          <li>Reactive updates</li>
          <li>Svelte idiomatic</li>
        </ul>
      </div>
    </div>
  </div>
</div>
