// /// <reference path="Dom.ts" />
// /// <reference path="Util.ts" />

// //Interact.with(selector).on.change.do(action).if(conditionFn).isTrue.do(sequencableAction).and.do(sequencableAtion).else.do(sequencableAction).and.do(sequencableAction).then.do(action)
// //Interact.with(selector).on.click.update(element).then.do(sequencableAction).then.if(conditionFn).isTrue.store(name, value);
// //Interact.with(myButton).on.click.if(() => this.isEnabled).do((element, event)=>alert(element.id)).then.update(selector);
// //Interact.do.read(variablename).as("name").then.if(()=>this.name).eq(value).do(action)
// //Interact.with(selector).remove.click

// //this = working context
// //args = element, event

// namespace Good {
//     namespace Interaction {
//         type InteractionType = string;
//         class Interactions {
//             static Click: InteractionType = "click";
//             static Change: InteractionType = "change";
//         }
//         type ActionType = string;
//         class CustomAction {
//             static Store: ActionType = "store";
//             static Update: ActionType = "update";
//             static Read: ActionType = "read";
//         }
//         enum NodeTypes {
//             Start = 0,
//             With = 1,
//             On = 2,
//             If = 3,
//             IsTrue = 4,
//             IsFalse = 5,
//             Do = 6,
//             And = 7,
//             Else = 8,
//             Then = 9,
//             Eq = 10,
//             Read = 11,
//             Update = 12,
//             Store = 13,
//             ReadAs = 14,
//             StoreAs = 15,

//         }
//         interface IInteractionNode {
//             // private _nodeType: NodeTypes;
//             // private _context: InteractionContext;
//         }
//         interface IInternalInteractionNode extends IInteractionNode {
//             __nodeType: NodeTypes;
//             __context: InteractionContext;
//         }
//         interface IStartNode extends IInteractionNode {
//         }
//         interface IChainNode extends IInteractionNode {
//             And: IActionNode;
//             Then: IActionNode;
//         }
//         interface IActionFunction extends Function {
//             (actionFn: (element?: Element, event?: any) => void) : IChainNode;
//         }
//         interface IAsFunction extends Function {
//             (propertyName: string): IChainNode
//         }
//         interface IAsReadNode extends IInteractionNode {
//             As: IAsFunction
//         }
//         interface IAsStoreNode extends IInteractionNode {
//             As: IAsFunction
//         }
//         interface IStoreFn extends Function {
//             (element?: Element, event?: any): any;
//         }
//         interface IDoNode extends IInteractionNode, IActionFunction {
//             Update: (selector: string) => IChainNode;
//             Read: (variableName: string) => IAsReadNode;
//             Store: (value:string | IStoreFn) => IAsStoreNode;
//         }
//         interface IDoStartNode extends IStartNode, IDoNode {
//         }
//         interface IEqFunction extends Function {
//             (eqFn: (element?: Element, event?: any) => any) : IActionNode;
//         }
//         interface IIfChainNode extends IInteractionNode {
//             Eq: IEqFunction;
//             IsTrue: IActionNode;
//             IsFalse: IActionNode;
//         }
//         interface IIfNode extends Function {
//             (conditionFn: (element?: Element, event?: any) => any) : IIfChainNode;
//         }
//         interface IActionNode extends IInteractionNode {
//             Do: IDoNode;
//         }
//         interface IOnActionNode extends IInteractionNode {
//             If: IIfNode;
//             Do: IDoNode;
//         }
//         interface IOnNode extends IInteractionNode {
//             Click: IOnActionNode;
//             Change: IOnActionNode;
//         }

//         interface IWithNode extends IStartNode {
//             On: IOnNode;
//         }
//         interface IWithFunction extends Function {
//             (selector: string | Element): IWithNode
//         }
//         interface IInternalInteract extends IInteract {
//             _context: InteractionContext;
//         }
//         interface IInteract {
//             With: IWithFunction;
//             Do: IDoStartNode;
//         }
//         class InteractionContext {
//             __selector: string;
//             __target: Array<Element>;
//             __interaction: Interactions;
//             __queue: Array<IInteractionNode>;

//             constructor() {
//                 this.__selector = null;
//                 this.__target = null;
//                 this.__interaction = null;
//                 this.__queue = new Array<IInteractionNode>();
//             }
//         }
//         var Test = function () {
//             var Interact:IInteract;
//             Interact
//                 .With("selector")
//                 .On.Click
//                 .If(()=>true).IsTrue
//                 .Do.Read("somevalue").As("myvalue") //A
//                 .And.Do(()=>{ /* stuff*/ }) //B paralell with A
//                 .Then.Do.Store(()=>this.myvalue).As("truevalue") //C seriell with A & B
//                 .And.Do.Update("selector"); //D paralell with C
//         }
//         class OnActionNode implements IOnActionNode {
//             public If(conditionFn: (element?: Element, event?: any) => any): IIfChainNode {
//                 let result = new IfChainNode();
//                 let context = (<IInternalInteract><any>Interact)._context;
//                 context.__queue.push(result);;
//                 return result;
//             }
//             public get Do(): IDoNode {
//                 let result = new DoNode();
//                 let context = (<IInternalInteract><any>Interact)._context;
//                 context.__queue.push(result);;
//                 return result;
//             }
//         }
//         class OnNode implements IOnNode {
//             public get Click(): IOnActionNode {
//                 return this.AddAction(Interactions.Click);
//             }
//             public get Change(): IOnActionNode {
//                 return this.AddAction(Interactions.Change);
//             }
//             private AddAction(action: Interactions): IOnActionNode {
//                 let result = new OnActionNode();
//                 let context = (<IInternalInteract><any>Interact)._context;
//                 context.__interaction = action;
//                 context.__queue.push(this);
//                 return result;
//             }
//         }
//         class WithNode implements IWithNode {
//             public get On(): IOnNode {
//                 let result = new OnNode();
//                 (<IInternalInteract><any>Interact)._context.__queue.push(result);;
//                 return result;
//             }
//         }
//         export class _Interact implements IInteract {
//             public _(win: Window):_Interact {
//                 return new _Interact(win);
//             }
            
//             private _window: Window = window;
//             private _document: Document = document;

//             private _interactions: Array<InteractionContext>;

//             constructor(win: Window) {
//                 this.Init(win);
//                 this.Do = new DoStartNode();
//                 this._interactions = new Array<InteractionContext>();
//             }
//             private Init(win: Window) {
//                 if(win !== undefined) {
//                     this._window = win;
//                     this._document = this._window.document; 
//                 }
//             }
//             private _workingContext: InteractionContext;
//             public With (selector: string | Element): IWithNode {
//                 let context = new InteractionContext();
//                 if("string" === typeof(selector)) {
//                     context.__selector = selector;
//                     context.__target = Util.ToArray(Dom.FindAll(selector));
//                 } else {
//                     context.__target = [selector];
//                 }
//                 this._interactions.push(context);
//                 this.Execute(context);
//                 let result = new WithNode(context);
                
//             }
//             public Do: IDoStartNode;
//             private Execute(context: InteractionContext): void {
//                 Util.Async(() => {
//                     this.ConsumeNodes(context);
//                 });
//             }
//             private ConsumeNodes(context: InteractionContext): void {
//                 let node: IInternalInteractionNode;
//                 while(node = <IInternalInteractionNode> context.__queue.shift()) {
//                     switch(node.__nodeType) {
//                         case NodeTypes.Start:
//                         break;
//                         case NodeTypes.With:
//                         break;
//                         case NodeTypes.On:
//                         break;
//                         case NodeTypes.If:
//                         break;
//                         case NodeTypes.IsTrue:
//                         break;
//                         case NodeTypes.IsFalse:
//                         break;
//                         case NodeTypes.Do:
//                         break;
//                         case NodeTypes.And:
//                         break;
//                         case NodeTypes.Else:
//                         break;
//                         case NodeTypes.Then:
//                         break;
//                         case NodeTypes.Eq:
//                         break;
//                         case NodeTypes.Read:
//                         break;
//                         case NodeTypes.Update:
//                         break;
//                         case NodeTypes.Store:
//                         break;
//                         case NodeTypes.ReadAs:
//                         break;
//                         case NodeTypes.StoreAs:
//                         break;
//                     }
//                 }
//             }
//         }
//     }
//     export var Interact:Interaction._Interact = new Interaction._Interact(window);
// }