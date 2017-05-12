// import {Dom} from "../Dom";
// import List from "../struct/List";
// import {Util} from "../Util";

// const CustomActions = new List<string> (["Store", "Update", "Read"]);
// export interface ICustomActions {
//			 Store: IGeneralCustomActionFn;
//			 Update: IGeneralCustomActionFn;
//			 Read: IGeneralCustomActionFn;
//		 }
// class CustomActionFn {
//			 Store(selector: string | ((...args: any[]) => string), ...args: any[]): IAsNode {
//				 const result = new AsNode((this as any).Context);
//				 return result;
//			 }
//			 Update(selector: string | ((...args: any[]) => string), ...args: any[]): IChainNode {
//				 const result = new ChainNode((this as any).Context);
//				 return result;
//			 }
//			 Delete(selector: string | ((...args: any[]) => string), ...args: any[]): IAsNode {
//				 const result = new AsNode((this as any).Context);
//				 return result;
//			 }
//		 }

// //Interact.with(selector).on.change.do(action).if(conditionFn).isTrue.do(sequencableAction).and.do(sequencableAtion).else.do(sequencableAction).and.do(sequencableAction).then.do(action)
// //Interact.with(selector).on.click.update(element).then.do(sequencableAction).then.if(conditionFn).isTrue.store(name, value);
// //Interact.with(myButton).on.click.if(() => this.isEnabled).do((element, event)=>alert(element.id)).then.update(selector);
// //Interact.do.read(variablename).as("name").then.if(()=>this.name).eq(value).do(action)
// //Interact.with(selector).remove.click

// //this = working context
// //args = element, event

// export type InteractionType = string;
// export class Interactions {
//			 static Click: InteractionType = "click";
//			 static Change: InteractionType = "change";
//		 }
// export type ActionType = string;
// export type IGeneralCustomActionFn = (selector: string | ((...args: any[]) => string), ...args: any[]) => IChainNode & IAsNode;
// export enum NodeTypes {
//			 Start = 0,
//			 With = 1,
//			 On = 2,
//			 If = 3,
//			 IsTrue = 4,
//			 IsFalse = 5,
//			 Do = 6,
//			 And = 7,
//			 Else = 8,
//			 Then = 9,
//			 Eq = 10,
//			 As = 11,
//			 StartDo = 12,
//			 Custom = 13

//		 }
// export interface IInteractionNode {

//		 }
// interface IInternalInteractionNode extends IInteractionNode {
//			 __nodeType: NodeTypes;
//			 Context: InteractionContext;
//		 }
// export interface IStartNode extends IInteractionNode {
//		 }
// export interface IChainNode extends IInteractionNode {
//			 And: IActionNode;
//			 Then: IActionNode;
//		 }
// type IActionFunction = (actionFn: (element?: Element, event?: any) => void)  => IChainNode;
// type IAsFunction = (propertyName: string) => IChainNode;
// export interface IAsNode extends IInteractionNode {
//			 As: IAsFunction;
//		 }
// type IStoreFn = (element?: Element, event?: any) => any;
// export interface IDoNode extends IInteractionNode, IActionFunction, ICustomActions {
//		 }
// export interface IDoStartNode extends IStartNode, IDoNode {
//		 }
// type IEqFunction = (eqFn: (element?: Element, event?: any) => any)  => IActionNode;
// export interface IIfChainNode extends IInteractionNode {
//			 Eq: IEqFunction;
//			 IsTrue: IActionNode;
//			 IsFalse: IActionNode;
//		 }
// type IIfNode = (conditionFn: (element?: Element, event?: any) => any)  => IIfChainNode;
// export interface IActionNode extends IInteractionNode {
//			 Do: IDoNode;
//		 }
// export interface IOnActionNode extends IInteractionNode {
//			 If: IIfNode;
//			 Do: IDoNode;
//		 }
// export interface IOnNode extends IInteractionNode {
//			 Click: IOnActionNode;
//			 Change: IOnActionNode;
//		 }

// export interface IWithNode extends IStartNode {
//			 On: IOnNode;
//		 }
// type IWithFunction = (selector: string | Element) => IWithNode;
// interface IInternalInteract extends IInteract {
//			 _context: InteractionContext;
//		 }
// export interface IInteract {
//			 With: IWithFunction;
//			 Do: IDoStartNode;
//		 }
// export class InteractionContext {
//			 __selector: string;
//			 __target: Element[];
//			 __interaction: Interactions;
//			 __queue: IInteractionNode[];

//			 constructor() {
//				 this.__selector = null;
//				 this.__target = null;
//				 this.__interaction = null;
//				 this.__queue = new Array<IInteractionNode>();
//			 }
//		 }
// export class InteractionNode implements IInteractionNode {
//			 NodeType: NodeTypes;
//			 Context: InteractionContext;
//			 constructor(context: InteractionContext) {
//				 this.Context = context;
//			 }
//		 }

// const Test = function() {
//			 let Interact: IInteract;
//			 Interact
//				 .With("selector")
//				 .On.Click
//				 .If(() => true).IsTrue
//				 .Do.Read("somevalue").As("myvalue") //A
//				 .And.Do(() => { /* stuff*/ }) //B paralell with A
//				 .Then.Do.Store(() => this.myvalue).As("truevalue") //C seriell with A & B
//				 .And.Do.Update("selector"); //D paralell with C
//		 };
// export class AsNode extends InteractionNode implements IAsNode {
//			 constructor(context: InteractionContext) {
//				 super(context);
//				 (this as IInternalInteractionNode as any).__nodeType = NodeTypes.As;
//			 }
//			 Result: any;
//			 Name: string;
//			 As(propertyName: string): IChainNode {
//				 const result = new ChainNode(this.Context);
//				 this.Name = propertyName;
//				 //should
//				 //this.Context[propertyName] = this.Result;
//				 return result;
//			 }
//		 }
// export class ChainNode extends InteractionNode implements IChainNode {
//			 constructor(context: InteractionContext) {
//				 super(context);
//			 }
//			 public IsAnd: boolean;
//			 public IsThen: boolean;
//			 get And(): IActionNode {
//				 const result = new ActionNode(this.Context);
//				 (this as any as IInternalInteractionNode).__nodeType = NodeTypes.And;
//				 this.IsAnd = true;
//				 this.Context.__queue.push(this);
//				 return result;
//			 }
//			 get Then(): IActionNode {
//				 const result = new ActionNode(this.Context);
//				 (this as IInternalInteractionNode as any).__nodeType = NodeTypes.Then;
//				 this.IsThen = true;
//				 this.Context.__queue.push(this);
//				 return result;
//			 }
//		 }
// export function CustomActionHandler(
// 	actionName: string, 
// 	context: InteractionContext, 
// 	selector: string | ((...args: any[]) => string), 
// 	...args: any[] 
// ): IChainNode & IAsNode {
//			 let result: any;
//			 this.ActionName = name;
//			 this.ActionFn = (CustomActionFn.prototype as any)[actionName].bind(this, ...args);
//			 this.Context.__queue.push(this);
//			 return result;
//		 }
// export function DoNodeFactory(
// 	context: InteractionContext, 
// 	isStartNode: boolean = false,
// 	 interact?: _Interact
// ): IDoNode {

//			 const node: IDoNode = function(actionFn: (element?: Element, event?: any) => void
//			 ) : IChainNode {
//				 (node as any).ActionFn = actionFn;
//				 if ((node as any).IsStartNode) {
//					 interact.Interactions.push(context);
//					 interact.Execute(context);
//					 (this as any as IInternalInteractionNode).__nodeType = NodeTypes.Start;
//				 } {
//					 (this as any as IInternalInteractionNode).__nodeType = NodeTypes.Do;
//				 }
//				 this.Context.__queue.push(node);
//				 const result = new ChainNode(context);
//				 return result;
//			 } as any;
//			 (node as any).IsStartNode = isStartNode;
//			 (this as IInternalInteractionNode as any).__nodeType = NodeTypes.Do;

//			 CustomActions.ForEach((name) => (node as any)[name] = CustomActionHandler.bind(node, name, context));
//			 // node.Update = function(selector: string): IChainNode {};
//			 // node.Read = function(variableName: string): IAsReadNode {};
//			 // node.Store = function(value: string | IStoreFn): IAsStoreNode {};
//			 const inode = node as any;
//			 inode.NodeType = NodeTypes.Do;
//			 inode.Context = context;

//			 return node;
//		 }
// export class ActionNode extends InteractionNode implements IActionNode {
//			 constructor(context: InteractionContext) {
//				 super(context);
//				 this.Do = DoNodeFactory.call(this, context);
//			 }
//			 Do: IDoNode;
//			 NodeType: NodeTypes;
//			 Context: InteractionContext;
//		 }
// export class IfChainNode extends InteractionNode implements IIfChainNode {
//			 constructor(context: InteractionContext) {
//				 super(context);
//				 (this as IInternalInteractionNode as any).__nodeType = NodeTypes.If;
//			 }
//			 Condition: (...args: any[]) => boolean;
//			 TrueCheck: boolean;
//			 FalseCheck: boolean;
//			 Eq(eqFn: (element?: Element, event?: any) => any) : IActionNode {
//				 this.Condition = eqFn;
//				 this.Context.__queue.push(this);
//				 const result = new ActionNode(this.Context);
//				 return result;
//			 }

//			 get IsTrue(): IActionNode {
//				 this.TrueCheck = true;
//				 this.Context.__queue.push(this);
//				 const result = new ActionNode(this.Context);
//				 return result;
//			 }
//			 get IsFalse(): IActionNode {
//				 this.FalseCheck = true;
//				 this.Context.__queue.push(this);
//				 const result = new ActionNode(this.Context);
//				 return result;
//			 }
//		 }
// export class OnActionNode extends InteractionNode implements IOnActionNode {
//			 Condition: (element?: Element, event?: any) => any;
//			 IsDo: boolean;
//			 IsIf: boolean;
//			 constructor(context: InteractionContext) {
//				 super(context);
//				 this.Do = DoNodeFactory(this.Context);
//			 }
//			 public If(conditionFn: (element?: Element, event?: any) => any): IIfChainNode {
//				 (this as IInternalInteractionNode as any).__nodeType = NodeTypes.If;
//				 this.IsIf = true;
//				 this.Condition = conditionFn;
//				 this.Context.__queue.push(this);
//				 const result = new IfChainNode(this.Context);
//				 return result;
//			 }
//			 Do: IDoNode;
//		 }
// export class OnNode extends InteractionNode implements IOnNode {
//			 constructor(context: InteractionContext) {
//				 super(context);
//				 (this as IInternalInteractionNode as any).__nodeType = NodeTypes.On;
//			 }
//			 public get Click(): IOnActionNode {
//				 return this.AddAction(Interactions.Click);
//			 }
//			 public get Change(): IOnActionNode {
//				 return this.AddAction(Interactions.Change);
//			 }
//			 private AddAction(action: Interactions): IOnActionNode {
//				 this.Context.__interaction = action;
//				 this.Context.__queue.push(this);
//				 const result = new OnActionNode(this.Context);
//				 return result;
//			 }
//		 }
// export class WithNode extends InteractionNode implements IWithNode {
//			 constructor(context: InteractionContext) {
//				 super(context);
//				 (this as IInternalInteractionNode as any).__nodeType = NodeTypes.With;
//			 }
//			 public get On(): IOnNode {
//				 this.Context.__queue.push(this);
//				 const result = new OnNode(this.Context);
//				 return result;
//			 }
//		 }
// export class _Interact implements IInteract {
//			 public _(win: Window): _Interact {
//				 return new _Interact(win);
//			 }

//			 private _window: Window = window;
//			 private _document: Document = document;

//			 public Interactions: InteractionContext[];

//			 constructor(win: Window) {
//				 this.Init(win);
//				 const context = new InteractionContext();
//				 this.Do = DoNodeFactory(context, true, this);
//				 this.Interactions = new Array<InteractionContext>();
//			 }
//			 private Init(win: Window) {
//				 if (win !== undefined) {
//					 this._window = win;
//					 this._document = this._window.document;
//				 }
//			 }
//			 private _workingContext: InteractionContext;
//			 public With(selector: string | Element): IWithNode {
//				 const context = new InteractionContext();
//				 if ("string" === typeof(selector)) {
//					 context.__selector = selector;
//					 context.__target = Util.ToArray(Dom.FindAll(selector));
//				 } else {
//					 context.__target = [selector];
//				 }
//				 this.Interactions.push(context);
//				 this.Execute(context);
//				 const result = new WithNode(context);
//				 return result;
//			 }
//			 public Do: IDoStartNode;
//			 public Execute(context: InteractionContext): void {
//				 Util.Async(() => {
//					 this.ConsumeNodes(context);
//				 });
//			 }
//			 private ConsumeNodes(context: InteractionContext): void {
//				 let node: IInternalInteractionNode;
//				 while (node = context.__queue.shift() as IInternalInteractionNode) {
//					 switch (node.__nodeType) {
//						 // case NodeTypes.Start:
//						 // break;
//						 // case NodeTypes.With:
//						 // break;
//						 // case NodeTypes.On:
//						 // break;
//						 // case NodeTypes.If:
//						 // break;
//						 // case NodeTypes.IsTrue:
//						 // break;
//						 // case NodeTypes.IsFalse:
//						 // break;
//						 // case NodeTypes.Do:
//						 // break;
//						 // case NodeTypes.And:
//						 // break;
//						 // case NodeTypes.Else:
//						 // break;
//						 // case NodeTypes.Then:
//						 // break;
//						 // case NodeTypes.Eq:
//						 // break;
//						 // case NodeTypes.Read:
//						 // break;
//						 // case NodeTypes.Update:
//						 // break;
//						 // case NodeTypes.Store:
//						 // break;
//						 // case NodeTypes.ReadAs:
//						 // break;
//						 // case NodeTypes.StoreAs:
//						 // break;
//						 default:
//							 console.log(node.__nodeType, node);
//							 break;
//					 }
//				 }
//			 }
//		 }

// //custom actions
//			 // node.Update = function(selector: string): IChainNode {};
//			 // node.Read = function(variableName: string): IAsReadNode {};
//			 // node.Store = function(value: string | IStoreFn): IAsStoreNode {};
