import { writable } from 'svelte/store'

export const feed = writable(Array());
export const hashtags = writable(Array());