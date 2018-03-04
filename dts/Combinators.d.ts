/// <reference path="base.d.ts" />

export function before<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function after<S>(decoration: (name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function around<S>(decoration: (callback: Function, name: string, ...args: any[]) => void): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function provided<S>(condition: (name: string, ...args: any[]) => boolean): (target: S, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function once<S>(target: S, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
