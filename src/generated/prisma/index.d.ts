
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Friendship
 * 
 */
export type Friendship = $Result.DefaultSelection<Prisma.$FriendshipPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Gathering
 * 
 */
export type Gathering = $Result.DefaultSelection<Prisma.$GatheringPayload>
/**
 * Model Expense
 * 
 */
export type Expense = $Result.DefaultSelection<Prisma.$ExpensePayload>
/**
 * Model ExpenseParticipant
 * 
 */
export type ExpenseParticipant = $Result.DefaultSelection<Prisma.$ExpenseParticipantPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const FriendshipStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

export type FriendshipStatus = (typeof FriendshipStatus)[keyof typeof FriendshipStatus]


export const TransactionType: {
  DEBT: 'DEBT',
  PAYMENT: 'PAYMENT'
};

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]


export const TransactionStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED'
};

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]


export const NotificationType: {
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  TRANSACTION_PENDING: 'TRANSACTION_PENDING',
  TRANSACTION_CONFIRMED: 'TRANSACTION_CONFIRMED',
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
  GENERAL: 'GENERAL'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

}

export type FriendshipStatus = $Enums.FriendshipStatus

export const FriendshipStatus: typeof $Enums.FriendshipStatus

export type TransactionType = $Enums.TransactionType

export const TransactionType: typeof $Enums.TransactionType

export type TransactionStatus = $Enums.TransactionStatus

export const TransactionStatus: typeof $Enums.TransactionStatus

export type NotificationType = $Enums.NotificationType

export const NotificationType: typeof $Enums.NotificationType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.friendship`: Exposes CRUD operations for the **Friendship** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Friendships
    * const friendships = await prisma.friendship.findMany()
    * ```
    */
  get friendship(): Prisma.FriendshipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gathering`: Exposes CRUD operations for the **Gathering** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Gatherings
    * const gatherings = await prisma.gathering.findMany()
    * ```
    */
  get gathering(): Prisma.GatheringDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.expense`: Exposes CRUD operations for the **Expense** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Expenses
    * const expenses = await prisma.expense.findMany()
    * ```
    */
  get expense(): Prisma.ExpenseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.expenseParticipant`: Exposes CRUD operations for the **ExpenseParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExpenseParticipants
    * const expenseParticipants = await prisma.expenseParticipant.findMany()
    * ```
    */
  get expenseParticipant(): Prisma.ExpenseParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Friendship: 'Friendship',
    Transaction: 'Transaction',
    Gathering: 'Gathering',
    Expense: 'Expense',
    ExpenseParticipant: 'ExpenseParticipant',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "friendship" | "transaction" | "gathering" | "expense" | "expenseParticipant" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Friendship: {
        payload: Prisma.$FriendshipPayload<ExtArgs>
        fields: Prisma.FriendshipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FriendshipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FriendshipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findFirst: {
            args: Prisma.FriendshipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FriendshipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findMany: {
            args: Prisma.FriendshipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          create: {
            args: Prisma.FriendshipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          createMany: {
            args: Prisma.FriendshipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FriendshipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          delete: {
            args: Prisma.FriendshipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          update: {
            args: Prisma.FriendshipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          deleteMany: {
            args: Prisma.FriendshipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FriendshipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FriendshipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          upsert: {
            args: Prisma.FriendshipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          aggregate: {
            args: Prisma.FriendshipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFriendship>
          }
          groupBy: {
            args: Prisma.FriendshipGroupByArgs<ExtArgs>
            result: $Utils.Optional<FriendshipGroupByOutputType>[]
          }
          count: {
            args: Prisma.FriendshipCountArgs<ExtArgs>
            result: $Utils.Optional<FriendshipCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Gathering: {
        payload: Prisma.$GatheringPayload<ExtArgs>
        fields: Prisma.GatheringFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GatheringFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GatheringFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>
          }
          findFirst: {
            args: Prisma.GatheringFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GatheringFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>
          }
          findMany: {
            args: Prisma.GatheringFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>[]
          }
          create: {
            args: Prisma.GatheringCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>
          }
          createMany: {
            args: Prisma.GatheringCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GatheringCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>[]
          }
          delete: {
            args: Prisma.GatheringDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>
          }
          update: {
            args: Prisma.GatheringUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>
          }
          deleteMany: {
            args: Prisma.GatheringDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GatheringUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GatheringUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>[]
          }
          upsert: {
            args: Prisma.GatheringUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatheringPayload>
          }
          aggregate: {
            args: Prisma.GatheringAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGathering>
          }
          groupBy: {
            args: Prisma.GatheringGroupByArgs<ExtArgs>
            result: $Utils.Optional<GatheringGroupByOutputType>[]
          }
          count: {
            args: Prisma.GatheringCountArgs<ExtArgs>
            result: $Utils.Optional<GatheringCountAggregateOutputType> | number
          }
        }
      }
      Expense: {
        payload: Prisma.$ExpensePayload<ExtArgs>
        fields: Prisma.ExpenseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExpenseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExpenseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>
          }
          findFirst: {
            args: Prisma.ExpenseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExpenseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>
          }
          findMany: {
            args: Prisma.ExpenseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>[]
          }
          create: {
            args: Prisma.ExpenseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>
          }
          createMany: {
            args: Prisma.ExpenseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExpenseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>[]
          }
          delete: {
            args: Prisma.ExpenseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>
          }
          update: {
            args: Prisma.ExpenseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>
          }
          deleteMany: {
            args: Prisma.ExpenseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExpenseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExpenseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>[]
          }
          upsert: {
            args: Prisma.ExpenseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpensePayload>
          }
          aggregate: {
            args: Prisma.ExpenseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExpense>
          }
          groupBy: {
            args: Prisma.ExpenseGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExpenseGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExpenseCountArgs<ExtArgs>
            result: $Utils.Optional<ExpenseCountAggregateOutputType> | number
          }
        }
      }
      ExpenseParticipant: {
        payload: Prisma.$ExpenseParticipantPayload<ExtArgs>
        fields: Prisma.ExpenseParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExpenseParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExpenseParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>
          }
          findFirst: {
            args: Prisma.ExpenseParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExpenseParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>
          }
          findMany: {
            args: Prisma.ExpenseParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>[]
          }
          create: {
            args: Prisma.ExpenseParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>
          }
          createMany: {
            args: Prisma.ExpenseParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExpenseParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>[]
          }
          delete: {
            args: Prisma.ExpenseParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>
          }
          update: {
            args: Prisma.ExpenseParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>
          }
          deleteMany: {
            args: Prisma.ExpenseParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExpenseParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExpenseParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>[]
          }
          upsert: {
            args: Prisma.ExpenseParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpenseParticipantPayload>
          }
          aggregate: {
            args: Prisma.ExpenseParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExpenseParticipant>
          }
          groupBy: {
            args: Prisma.ExpenseParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExpenseParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExpenseParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<ExpenseParticipantCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    friendship?: FriendshipOmit
    transaction?: TransactionOmit
    gathering?: GatheringOmit
    expense?: ExpenseOmit
    expenseParticipant?: ExpenseParticipantOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    friendshipsSent: number
    friendshipsReceived: number
    transactionsCreated: number
    transactionsDebtor: number
    transactionsCreditor: number
    transactionsToConfirm: number
    gatherings: number
    expensesCreated: number
    expenseParticipations: number
    notifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    friendshipsSent?: boolean | UserCountOutputTypeCountFriendshipsSentArgs
    friendshipsReceived?: boolean | UserCountOutputTypeCountFriendshipsReceivedArgs
    transactionsCreated?: boolean | UserCountOutputTypeCountTransactionsCreatedArgs
    transactionsDebtor?: boolean | UserCountOutputTypeCountTransactionsDebtorArgs
    transactionsCreditor?: boolean | UserCountOutputTypeCountTransactionsCreditorArgs
    transactionsToConfirm?: boolean | UserCountOutputTypeCountTransactionsToConfirmArgs
    gatherings?: boolean | UserCountOutputTypeCountGatheringsArgs
    expensesCreated?: boolean | UserCountOutputTypeCountExpensesCreatedArgs
    expenseParticipations?: boolean | UserCountOutputTypeCountExpenseParticipationsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFriendshipsSentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFriendshipsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsDebtorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsCreditorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsToConfirmArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGatheringsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GatheringWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExpensesCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpenseWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExpenseParticipationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpenseParticipantWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type FriendshipCountOutputType
   */

  export type FriendshipCountOutputType = {
    notifications: number
  }

  export type FriendshipCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | FriendshipCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * FriendshipCountOutputType without action
   */
  export type FriendshipCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendshipCountOutputType
     */
    select?: FriendshipCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FriendshipCountOutputType without action
   */
  export type FriendshipCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type TransactionCountOutputType
   */

  export type TransactionCountOutputType = {
    notifications: number
  }

  export type TransactionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | TransactionCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionCountOutputType
     */
    select?: TransactionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type GatheringCountOutputType
   */

  export type GatheringCountOutputType = {
    expenses: number
    notifications: number
  }

  export type GatheringCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    expenses?: boolean | GatheringCountOutputTypeCountExpensesArgs
    notifications?: boolean | GatheringCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * GatheringCountOutputType without action
   */
  export type GatheringCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GatheringCountOutputType
     */
    select?: GatheringCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GatheringCountOutputType without action
   */
  export type GatheringCountOutputTypeCountExpensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpenseWhereInput
  }

  /**
   * GatheringCountOutputType without action
   */
  export type GatheringCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type ExpenseCountOutputType
   */

  export type ExpenseCountOutputType = {
    participants: number
  }

  export type ExpenseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | ExpenseCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * ExpenseCountOutputType without action
   */
  export type ExpenseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseCountOutputType
     */
    select?: ExpenseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExpenseCountOutputType without action
   */
  export type ExpenseCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpenseParticipantWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    username: string | null
    email: string | null
    password: string | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    username: string | null
    email: string | null
    password: string | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    username: number
    email: number
    password: number
    avatar: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    username?: true
    email?: true
    password?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    username?: true
    email?: true
    password?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    username?: true
    email?: true
    password?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    username: string
    email: string
    password: string
    avatar: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    friendshipsSent?: boolean | User$friendshipsSentArgs<ExtArgs>
    friendshipsReceived?: boolean | User$friendshipsReceivedArgs<ExtArgs>
    transactionsCreated?: boolean | User$transactionsCreatedArgs<ExtArgs>
    transactionsDebtor?: boolean | User$transactionsDebtorArgs<ExtArgs>
    transactionsCreditor?: boolean | User$transactionsCreditorArgs<ExtArgs>
    transactionsToConfirm?: boolean | User$transactionsToConfirmArgs<ExtArgs>
    gatherings?: boolean | User$gatheringsArgs<ExtArgs>
    expensesCreated?: boolean | User$expensesCreatedArgs<ExtArgs>
    expenseParticipations?: boolean | User$expenseParticipationsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "username" | "email" | "password" | "avatar" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    friendshipsSent?: boolean | User$friendshipsSentArgs<ExtArgs>
    friendshipsReceived?: boolean | User$friendshipsReceivedArgs<ExtArgs>
    transactionsCreated?: boolean | User$transactionsCreatedArgs<ExtArgs>
    transactionsDebtor?: boolean | User$transactionsDebtorArgs<ExtArgs>
    transactionsCreditor?: boolean | User$transactionsCreditorArgs<ExtArgs>
    transactionsToConfirm?: boolean | User$transactionsToConfirmArgs<ExtArgs>
    gatherings?: boolean | User$gatheringsArgs<ExtArgs>
    expensesCreated?: boolean | User$expensesCreatedArgs<ExtArgs>
    expenseParticipations?: boolean | User$expenseParticipationsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      friendshipsSent: Prisma.$FriendshipPayload<ExtArgs>[]
      friendshipsReceived: Prisma.$FriendshipPayload<ExtArgs>[]
      transactionsCreated: Prisma.$TransactionPayload<ExtArgs>[]
      transactionsDebtor: Prisma.$TransactionPayload<ExtArgs>[]
      transactionsCreditor: Prisma.$TransactionPayload<ExtArgs>[]
      transactionsToConfirm: Prisma.$TransactionPayload<ExtArgs>[]
      gatherings: Prisma.$GatheringPayload<ExtArgs>[]
      expensesCreated: Prisma.$ExpensePayload<ExtArgs>[]
      expenseParticipations: Prisma.$ExpenseParticipantPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      username: string
      email: string
      password: string
      avatar: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    friendshipsSent<T extends User$friendshipsSentArgs<ExtArgs> = {}>(args?: Subset<T, User$friendshipsSentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    friendshipsReceived<T extends User$friendshipsReceivedArgs<ExtArgs> = {}>(args?: Subset<T, User$friendshipsReceivedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionsCreated<T extends User$transactionsCreatedArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsCreatedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionsDebtor<T extends User$transactionsDebtorArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsDebtorArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionsCreditor<T extends User$transactionsCreditorArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsCreditorArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionsToConfirm<T extends User$transactionsToConfirmArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsToConfirmArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gatherings<T extends User$gatheringsArgs<ExtArgs> = {}>(args?: Subset<T, User$gatheringsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    expensesCreated<T extends User$expensesCreatedArgs<ExtArgs> = {}>(args?: Subset<T, User$expensesCreatedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    expenseParticipations<T extends User$expenseParticipationsArgs<ExtArgs> = {}>(args?: Subset<T, User$expenseParticipationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.friendshipsSent
   */
  export type User$friendshipsSentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    cursor?: FriendshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * User.friendshipsReceived
   */
  export type User$friendshipsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    cursor?: FriendshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * User.transactionsCreated
   */
  export type User$transactionsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.transactionsDebtor
   */
  export type User$transactionsDebtorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.transactionsCreditor
   */
  export type User$transactionsCreditorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.transactionsToConfirm
   */
  export type User$transactionsToConfirmArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.gatherings
   */
  export type User$gatheringsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    where?: GatheringWhereInput
    orderBy?: GatheringOrderByWithRelationInput | GatheringOrderByWithRelationInput[]
    cursor?: GatheringWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GatheringScalarFieldEnum | GatheringScalarFieldEnum[]
  }

  /**
   * User.expensesCreated
   */
  export type User$expensesCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    where?: ExpenseWhereInput
    orderBy?: ExpenseOrderByWithRelationInput | ExpenseOrderByWithRelationInput[]
    cursor?: ExpenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExpenseScalarFieldEnum | ExpenseScalarFieldEnum[]
  }

  /**
   * User.expenseParticipations
   */
  export type User$expenseParticipationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    where?: ExpenseParticipantWhereInput
    orderBy?: ExpenseParticipantOrderByWithRelationInput | ExpenseParticipantOrderByWithRelationInput[]
    cursor?: ExpenseParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExpenseParticipantScalarFieldEnum | ExpenseParticipantScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Friendship
   */

  export type AggregateFriendship = {
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  export type FriendshipMinAggregateOutputType = {
    id: string | null
    requesterId: string | null
    addresseeId: string | null
    status: $Enums.FriendshipStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FriendshipMaxAggregateOutputType = {
    id: string | null
    requesterId: string | null
    addresseeId: string | null
    status: $Enums.FriendshipStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FriendshipCountAggregateOutputType = {
    id: number
    requesterId: number
    addresseeId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FriendshipMinAggregateInputType = {
    id?: true
    requesterId?: true
    addresseeId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FriendshipMaxAggregateInputType = {
    id?: true
    requesterId?: true
    addresseeId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FriendshipCountAggregateInputType = {
    id?: true
    requesterId?: true
    addresseeId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FriendshipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendship to aggregate.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Friendships
    **/
    _count?: true | FriendshipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FriendshipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FriendshipMaxAggregateInputType
  }

  export type GetFriendshipAggregateType<T extends FriendshipAggregateArgs> = {
        [P in keyof T & keyof AggregateFriendship]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFriendship[P]>
      : GetScalarType<T[P], AggregateFriendship[P]>
  }




  export type FriendshipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithAggregationInput | FriendshipOrderByWithAggregationInput[]
    by: FriendshipScalarFieldEnum[] | FriendshipScalarFieldEnum
    having?: FriendshipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FriendshipCountAggregateInputType | true
    _min?: FriendshipMinAggregateInputType
    _max?: FriendshipMaxAggregateInputType
  }

  export type FriendshipGroupByOutputType = {
    id: string
    requesterId: string
    addresseeId: string
    status: $Enums.FriendshipStatus
    createdAt: Date
    updatedAt: Date
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  type GetFriendshipGroupByPayload<T extends FriendshipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FriendshipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FriendshipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
            : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
        }
      >
    >


  export type FriendshipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    addresseeId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
    notifications?: boolean | Friendship$notificationsArgs<ExtArgs>
    _count?: boolean | FriendshipCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    addresseeId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    addresseeId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectScalar = {
    id?: boolean
    requesterId?: boolean
    addresseeId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FriendshipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requesterId" | "addresseeId" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["friendship"]>
  export type FriendshipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
    notifications?: boolean | Friendship$notificationsArgs<ExtArgs>
    _count?: boolean | FriendshipCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FriendshipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FriendshipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FriendshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Friendship"
    objects: {
      requester: Prisma.$UserPayload<ExtArgs>
      addressee: Prisma.$UserPayload<ExtArgs>
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requesterId: string
      addresseeId: string
      status: $Enums.FriendshipStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["friendship"]>
    composites: {}
  }

  type FriendshipGetPayload<S extends boolean | null | undefined | FriendshipDefaultArgs> = $Result.GetResult<Prisma.$FriendshipPayload, S>

  type FriendshipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FriendshipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FriendshipCountAggregateInputType | true
    }

  export interface FriendshipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Friendship'], meta: { name: 'Friendship' } }
    /**
     * Find zero or one Friendship that matches the filter.
     * @param {FriendshipFindUniqueArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FriendshipFindUniqueArgs>(args: SelectSubset<T, FriendshipFindUniqueArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Friendship that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FriendshipFindUniqueOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FriendshipFindUniqueOrThrowArgs>(args: SelectSubset<T, FriendshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FriendshipFindFirstArgs>(args?: SelectSubset<T, FriendshipFindFirstArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FriendshipFindFirstOrThrowArgs>(args?: SelectSubset<T, FriendshipFindFirstOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Friendships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Friendships
     * const friendships = await prisma.friendship.findMany()
     * 
     * // Get first 10 Friendships
     * const friendships = await prisma.friendship.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const friendshipWithIdOnly = await prisma.friendship.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FriendshipFindManyArgs>(args?: SelectSubset<T, FriendshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Friendship.
     * @param {FriendshipCreateArgs} args - Arguments to create a Friendship.
     * @example
     * // Create one Friendship
     * const Friendship = await prisma.friendship.create({
     *   data: {
     *     // ... data to create a Friendship
     *   }
     * })
     * 
     */
    create<T extends FriendshipCreateArgs>(args: SelectSubset<T, FriendshipCreateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Friendships.
     * @param {FriendshipCreateManyArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FriendshipCreateManyArgs>(args?: SelectSubset<T, FriendshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Friendships and returns the data saved in the database.
     * @param {FriendshipCreateManyAndReturnArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FriendshipCreateManyAndReturnArgs>(args?: SelectSubset<T, FriendshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Friendship.
     * @param {FriendshipDeleteArgs} args - Arguments to delete one Friendship.
     * @example
     * // Delete one Friendship
     * const Friendship = await prisma.friendship.delete({
     *   where: {
     *     // ... filter to delete one Friendship
     *   }
     * })
     * 
     */
    delete<T extends FriendshipDeleteArgs>(args: SelectSubset<T, FriendshipDeleteArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Friendship.
     * @param {FriendshipUpdateArgs} args - Arguments to update one Friendship.
     * @example
     * // Update one Friendship
     * const friendship = await prisma.friendship.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FriendshipUpdateArgs>(args: SelectSubset<T, FriendshipUpdateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Friendships.
     * @param {FriendshipDeleteManyArgs} args - Arguments to filter Friendships to delete.
     * @example
     * // Delete a few Friendships
     * const { count } = await prisma.friendship.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FriendshipDeleteManyArgs>(args?: SelectSubset<T, FriendshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FriendshipUpdateManyArgs>(args: SelectSubset<T, FriendshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships and returns the data updated in the database.
     * @param {FriendshipUpdateManyAndReturnArgs} args - Arguments to update many Friendships.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FriendshipUpdateManyAndReturnArgs>(args: SelectSubset<T, FriendshipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Friendship.
     * @param {FriendshipUpsertArgs} args - Arguments to update or create a Friendship.
     * @example
     * // Update or create a Friendship
     * const friendship = await prisma.friendship.upsert({
     *   create: {
     *     // ... data to create a Friendship
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Friendship we want to update
     *   }
     * })
     */
    upsert<T extends FriendshipUpsertArgs>(args: SelectSubset<T, FriendshipUpsertArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipCountArgs} args - Arguments to filter Friendships to count.
     * @example
     * // Count the number of Friendships
     * const count = await prisma.friendship.count({
     *   where: {
     *     // ... the filter for the Friendships we want to count
     *   }
     * })
    **/
    count<T extends FriendshipCountArgs>(
      args?: Subset<T, FriendshipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FriendshipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FriendshipAggregateArgs>(args: Subset<T, FriendshipAggregateArgs>): Prisma.PrismaPromise<GetFriendshipAggregateType<T>>

    /**
     * Group by Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FriendshipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FriendshipGroupByArgs['orderBy'] }
        : { orderBy?: FriendshipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FriendshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFriendshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Friendship model
   */
  readonly fields: FriendshipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Friendship.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FriendshipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requester<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    addressee<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    notifications<T extends Friendship$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Friendship$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Friendship model
   */
  interface FriendshipFieldRefs {
    readonly id: FieldRef<"Friendship", 'String'>
    readonly requesterId: FieldRef<"Friendship", 'String'>
    readonly addresseeId: FieldRef<"Friendship", 'String'>
    readonly status: FieldRef<"Friendship", 'FriendshipStatus'>
    readonly createdAt: FieldRef<"Friendship", 'DateTime'>
    readonly updatedAt: FieldRef<"Friendship", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Friendship findUnique
   */
  export type FriendshipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findUniqueOrThrow
   */
  export type FriendshipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findFirst
   */
  export type FriendshipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findFirstOrThrow
   */
  export type FriendshipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findMany
   */
  export type FriendshipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendships to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship create
   */
  export type FriendshipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The data needed to create a Friendship.
     */
    data: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
  }

  /**
   * Friendship createMany
   */
  export type FriendshipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Friendship createManyAndReturn
   */
  export type FriendshipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Friendship update
   */
  export type FriendshipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The data needed to update a Friendship.
     */
    data: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
    /**
     * Choose, which Friendship to update.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship updateMany
   */
  export type FriendshipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
  }

  /**
   * Friendship updateManyAndReturn
   */
  export type FriendshipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Friendship upsert
   */
  export type FriendshipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The filter to search for the Friendship to update in case it exists.
     */
    where: FriendshipWhereUniqueInput
    /**
     * In case the Friendship found by the `where` argument doesn't exist, create a new Friendship with this data.
     */
    create: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
    /**
     * In case the Friendship was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
  }

  /**
   * Friendship delete
   */
  export type FriendshipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter which Friendship to delete.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship deleteMany
   */
  export type FriendshipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendships to delete
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to delete.
     */
    limit?: number
  }

  /**
   * Friendship.notifications
   */
  export type Friendship$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Friendship without action
   */
  export type FriendshipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type TransactionSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    creatorId: string | null
    debtorId: string | null
    creditorId: string | null
    amount: Decimal | null
    currency: string | null
    description: string | null
    type: $Enums.TransactionType | null
    status: $Enums.TransactionStatus | null
    pendingConfirmationFromId: string | null
    occurredAt: Date | null
    confirmedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    creatorId: string | null
    debtorId: string | null
    creditorId: string | null
    amount: Decimal | null
    currency: string | null
    description: string | null
    type: $Enums.TransactionType | null
    status: $Enums.TransactionStatus | null
    pendingConfirmationFromId: string | null
    occurredAt: Date | null
    confirmedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    creatorId: number
    debtorId: number
    creditorId: number
    amount: number
    currency: number
    description: number
    type: number
    status: number
    pendingConfirmationFromId: number
    occurredAt: number
    confirmedAt: number
    rejectedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amount?: true
  }

  export type TransactionSumAggregateInputType = {
    amount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    creatorId?: true
    debtorId?: true
    creditorId?: true
    amount?: true
    currency?: true
    description?: true
    type?: true
    status?: true
    pendingConfirmationFromId?: true
    occurredAt?: true
    confirmedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    creatorId?: true
    debtorId?: true
    creditorId?: true
    amount?: true
    currency?: true
    description?: true
    type?: true
    status?: true
    pendingConfirmationFromId?: true
    occurredAt?: true
    confirmedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    creatorId?: true
    debtorId?: true
    creditorId?: true
    amount?: true
    currency?: true
    description?: true
    type?: true
    status?: true
    pendingConfirmationFromId?: true
    occurredAt?: true
    confirmedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    creatorId: string
    debtorId: string
    creditorId: string
    amount: Decimal
    currency: string
    description: string
    type: $Enums.TransactionType
    status: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt: Date
    confirmedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    creatorId?: boolean
    debtorId?: boolean
    creditorId?: boolean
    amount?: boolean
    currency?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    pendingConfirmationFromId?: boolean
    occurredAt?: boolean
    confirmedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    debtor?: boolean | UserDefaultArgs<ExtArgs>
    creditor?: boolean | UserDefaultArgs<ExtArgs>
    confirmationFrom?: boolean | UserDefaultArgs<ExtArgs>
    notifications?: boolean | Transaction$notificationsArgs<ExtArgs>
    _count?: boolean | TransactionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    creatorId?: boolean
    debtorId?: boolean
    creditorId?: boolean
    amount?: boolean
    currency?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    pendingConfirmationFromId?: boolean
    occurredAt?: boolean
    confirmedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    debtor?: boolean | UserDefaultArgs<ExtArgs>
    creditor?: boolean | UserDefaultArgs<ExtArgs>
    confirmationFrom?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    creatorId?: boolean
    debtorId?: boolean
    creditorId?: boolean
    amount?: boolean
    currency?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    pendingConfirmationFromId?: boolean
    occurredAt?: boolean
    confirmedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    debtor?: boolean | UserDefaultArgs<ExtArgs>
    creditor?: boolean | UserDefaultArgs<ExtArgs>
    confirmationFrom?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    creatorId?: boolean
    debtorId?: boolean
    creditorId?: boolean
    amount?: boolean
    currency?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    pendingConfirmationFromId?: boolean
    occurredAt?: boolean
    confirmedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "creatorId" | "debtorId" | "creditorId" | "amount" | "currency" | "description" | "type" | "status" | "pendingConfirmationFromId" | "occurredAt" | "confirmedAt" | "rejectedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    debtor?: boolean | UserDefaultArgs<ExtArgs>
    creditor?: boolean | UserDefaultArgs<ExtArgs>
    confirmationFrom?: boolean | UserDefaultArgs<ExtArgs>
    notifications?: boolean | Transaction$notificationsArgs<ExtArgs>
    _count?: boolean | TransactionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    debtor?: boolean | UserDefaultArgs<ExtArgs>
    creditor?: boolean | UserDefaultArgs<ExtArgs>
    confirmationFrom?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    debtor?: boolean | UserDefaultArgs<ExtArgs>
    creditor?: boolean | UserDefaultArgs<ExtArgs>
    confirmationFrom?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs>
      debtor: Prisma.$UserPayload<ExtArgs>
      creditor: Prisma.$UserPayload<ExtArgs>
      confirmationFrom: Prisma.$UserPayload<ExtArgs>
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      creatorId: string
      debtorId: string
      creditorId: string
      amount: Prisma.Decimal
      currency: string
      description: string
      type: $Enums.TransactionType
      status: $Enums.TransactionStatus
      pendingConfirmationFromId: string
      occurredAt: Date
      confirmedAt: Date | null
      rejectedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    debtor<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    creditor<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    confirmationFrom<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    notifications<T extends Transaction$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly creatorId: FieldRef<"Transaction", 'String'>
    readonly debtorId: FieldRef<"Transaction", 'String'>
    readonly creditorId: FieldRef<"Transaction", 'String'>
    readonly amount: FieldRef<"Transaction", 'Decimal'>
    readonly currency: FieldRef<"Transaction", 'String'>
    readonly description: FieldRef<"Transaction", 'String'>
    readonly type: FieldRef<"Transaction", 'TransactionType'>
    readonly status: FieldRef<"Transaction", 'TransactionStatus'>
    readonly pendingConfirmationFromId: FieldRef<"Transaction", 'String'>
    readonly occurredAt: FieldRef<"Transaction", 'DateTime'>
    readonly confirmedAt: FieldRef<"Transaction", 'DateTime'>
    readonly rejectedAt: FieldRef<"Transaction", 'DateTime'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction.notifications
   */
  export type Transaction$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Gathering
   */

  export type AggregateGathering = {
    _count: GatheringCountAggregateOutputType | null
    _min: GatheringMinAggregateOutputType | null
    _max: GatheringMaxAggregateOutputType | null
  }

  export type GatheringMinAggregateOutputType = {
    id: string | null
    creatorId: string | null
    name: string | null
    description: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GatheringMaxAggregateOutputType = {
    id: string | null
    creatorId: string | null
    name: string | null
    description: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GatheringCountAggregateOutputType = {
    id: number
    creatorId: number
    name: number
    description: number
    date: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GatheringMinAggregateInputType = {
    id?: true
    creatorId?: true
    name?: true
    description?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GatheringMaxAggregateInputType = {
    id?: true
    creatorId?: true
    name?: true
    description?: true
    date?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GatheringCountAggregateInputType = {
    id?: true
    creatorId?: true
    name?: true
    description?: true
    date?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GatheringAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gathering to aggregate.
     */
    where?: GatheringWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gatherings to fetch.
     */
    orderBy?: GatheringOrderByWithRelationInput | GatheringOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GatheringWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gatherings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gatherings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Gatherings
    **/
    _count?: true | GatheringCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GatheringMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GatheringMaxAggregateInputType
  }

  export type GetGatheringAggregateType<T extends GatheringAggregateArgs> = {
        [P in keyof T & keyof AggregateGathering]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGathering[P]>
      : GetScalarType<T[P], AggregateGathering[P]>
  }




  export type GatheringGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GatheringWhereInput
    orderBy?: GatheringOrderByWithAggregationInput | GatheringOrderByWithAggregationInput[]
    by: GatheringScalarFieldEnum[] | GatheringScalarFieldEnum
    having?: GatheringScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GatheringCountAggregateInputType | true
    _min?: GatheringMinAggregateInputType
    _max?: GatheringMaxAggregateInputType
  }

  export type GatheringGroupByOutputType = {
    id: string
    creatorId: string
    name: string
    description: string | null
    date: Date
    createdAt: Date
    updatedAt: Date
    _count: GatheringCountAggregateOutputType | null
    _min: GatheringMinAggregateOutputType | null
    _max: GatheringMaxAggregateOutputType | null
  }

  type GetGatheringGroupByPayload<T extends GatheringGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GatheringGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GatheringGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GatheringGroupByOutputType[P]>
            : GetScalarType<T[P], GatheringGroupByOutputType[P]>
        }
      >
    >


  export type GatheringSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    creatorId?: boolean
    name?: boolean
    description?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    expenses?: boolean | Gathering$expensesArgs<ExtArgs>
    notifications?: boolean | Gathering$notificationsArgs<ExtArgs>
    _count?: boolean | GatheringCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gathering"]>

  export type GatheringSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    creatorId?: boolean
    name?: boolean
    description?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gathering"]>

  export type GatheringSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    creatorId?: boolean
    name?: boolean
    description?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gathering"]>

  export type GatheringSelectScalar = {
    id?: boolean
    creatorId?: boolean
    name?: boolean
    description?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GatheringOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "creatorId" | "name" | "description" | "date" | "createdAt" | "updatedAt", ExtArgs["result"]["gathering"]>
  export type GatheringInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    expenses?: boolean | Gathering$expensesArgs<ExtArgs>
    notifications?: boolean | Gathering$notificationsArgs<ExtArgs>
    _count?: boolean | GatheringCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GatheringIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GatheringIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $GatheringPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Gathering"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs>
      expenses: Prisma.$ExpensePayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      creatorId: string
      name: string
      description: string | null
      date: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["gathering"]>
    composites: {}
  }

  type GatheringGetPayload<S extends boolean | null | undefined | GatheringDefaultArgs> = $Result.GetResult<Prisma.$GatheringPayload, S>

  type GatheringCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GatheringFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GatheringCountAggregateInputType | true
    }

  export interface GatheringDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Gathering'], meta: { name: 'Gathering' } }
    /**
     * Find zero or one Gathering that matches the filter.
     * @param {GatheringFindUniqueArgs} args - Arguments to find a Gathering
     * @example
     * // Get one Gathering
     * const gathering = await prisma.gathering.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GatheringFindUniqueArgs>(args: SelectSubset<T, GatheringFindUniqueArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Gathering that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GatheringFindUniqueOrThrowArgs} args - Arguments to find a Gathering
     * @example
     * // Get one Gathering
     * const gathering = await prisma.gathering.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GatheringFindUniqueOrThrowArgs>(args: SelectSubset<T, GatheringFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gathering that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GatheringFindFirstArgs} args - Arguments to find a Gathering
     * @example
     * // Get one Gathering
     * const gathering = await prisma.gathering.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GatheringFindFirstArgs>(args?: SelectSubset<T, GatheringFindFirstArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gathering that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GatheringFindFirstOrThrowArgs} args - Arguments to find a Gathering
     * @example
     * // Get one Gathering
     * const gathering = await prisma.gathering.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GatheringFindFirstOrThrowArgs>(args?: SelectSubset<T, GatheringFindFirstOrThrowArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Gatherings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GatheringFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Gatherings
     * const gatherings = await prisma.gathering.findMany()
     * 
     * // Get first 10 Gatherings
     * const gatherings = await prisma.gathering.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gatheringWithIdOnly = await prisma.gathering.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GatheringFindManyArgs>(args?: SelectSubset<T, GatheringFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Gathering.
     * @param {GatheringCreateArgs} args - Arguments to create a Gathering.
     * @example
     * // Create one Gathering
     * const Gathering = await prisma.gathering.create({
     *   data: {
     *     // ... data to create a Gathering
     *   }
     * })
     * 
     */
    create<T extends GatheringCreateArgs>(args: SelectSubset<T, GatheringCreateArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Gatherings.
     * @param {GatheringCreateManyArgs} args - Arguments to create many Gatherings.
     * @example
     * // Create many Gatherings
     * const gathering = await prisma.gathering.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GatheringCreateManyArgs>(args?: SelectSubset<T, GatheringCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Gatherings and returns the data saved in the database.
     * @param {GatheringCreateManyAndReturnArgs} args - Arguments to create many Gatherings.
     * @example
     * // Create many Gatherings
     * const gathering = await prisma.gathering.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Gatherings and only return the `id`
     * const gatheringWithIdOnly = await prisma.gathering.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GatheringCreateManyAndReturnArgs>(args?: SelectSubset<T, GatheringCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Gathering.
     * @param {GatheringDeleteArgs} args - Arguments to delete one Gathering.
     * @example
     * // Delete one Gathering
     * const Gathering = await prisma.gathering.delete({
     *   where: {
     *     // ... filter to delete one Gathering
     *   }
     * })
     * 
     */
    delete<T extends GatheringDeleteArgs>(args: SelectSubset<T, GatheringDeleteArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Gathering.
     * @param {GatheringUpdateArgs} args - Arguments to update one Gathering.
     * @example
     * // Update one Gathering
     * const gathering = await prisma.gathering.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GatheringUpdateArgs>(args: SelectSubset<T, GatheringUpdateArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Gatherings.
     * @param {GatheringDeleteManyArgs} args - Arguments to filter Gatherings to delete.
     * @example
     * // Delete a few Gatherings
     * const { count } = await prisma.gathering.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GatheringDeleteManyArgs>(args?: SelectSubset<T, GatheringDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gatherings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GatheringUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Gatherings
     * const gathering = await prisma.gathering.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GatheringUpdateManyArgs>(args: SelectSubset<T, GatheringUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gatherings and returns the data updated in the database.
     * @param {GatheringUpdateManyAndReturnArgs} args - Arguments to update many Gatherings.
     * @example
     * // Update many Gatherings
     * const gathering = await prisma.gathering.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Gatherings and only return the `id`
     * const gatheringWithIdOnly = await prisma.gathering.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GatheringUpdateManyAndReturnArgs>(args: SelectSubset<T, GatheringUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Gathering.
     * @param {GatheringUpsertArgs} args - Arguments to update or create a Gathering.
     * @example
     * // Update or create a Gathering
     * const gathering = await prisma.gathering.upsert({
     *   create: {
     *     // ... data to create a Gathering
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Gathering we want to update
     *   }
     * })
     */
    upsert<T extends GatheringUpsertArgs>(args: SelectSubset<T, GatheringUpsertArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Gatherings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GatheringCountArgs} args - Arguments to filter Gatherings to count.
     * @example
     * // Count the number of Gatherings
     * const count = await prisma.gathering.count({
     *   where: {
     *     // ... the filter for the Gatherings we want to count
     *   }
     * })
    **/
    count<T extends GatheringCountArgs>(
      args?: Subset<T, GatheringCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GatheringCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Gathering.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GatheringAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GatheringAggregateArgs>(args: Subset<T, GatheringAggregateArgs>): Prisma.PrismaPromise<GetGatheringAggregateType<T>>

    /**
     * Group by Gathering.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GatheringGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GatheringGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GatheringGroupByArgs['orderBy'] }
        : { orderBy?: GatheringGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GatheringGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGatheringGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Gathering model
   */
  readonly fields: GatheringFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Gathering.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GatheringClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    expenses<T extends Gathering$expensesArgs<ExtArgs> = {}>(args?: Subset<T, Gathering$expensesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends Gathering$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Gathering$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Gathering model
   */
  interface GatheringFieldRefs {
    readonly id: FieldRef<"Gathering", 'String'>
    readonly creatorId: FieldRef<"Gathering", 'String'>
    readonly name: FieldRef<"Gathering", 'String'>
    readonly description: FieldRef<"Gathering", 'String'>
    readonly date: FieldRef<"Gathering", 'DateTime'>
    readonly createdAt: FieldRef<"Gathering", 'DateTime'>
    readonly updatedAt: FieldRef<"Gathering", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Gathering findUnique
   */
  export type GatheringFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * Filter, which Gathering to fetch.
     */
    where: GatheringWhereUniqueInput
  }

  /**
   * Gathering findUniqueOrThrow
   */
  export type GatheringFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * Filter, which Gathering to fetch.
     */
    where: GatheringWhereUniqueInput
  }

  /**
   * Gathering findFirst
   */
  export type GatheringFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * Filter, which Gathering to fetch.
     */
    where?: GatheringWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gatherings to fetch.
     */
    orderBy?: GatheringOrderByWithRelationInput | GatheringOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gatherings.
     */
    cursor?: GatheringWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gatherings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gatherings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gatherings.
     */
    distinct?: GatheringScalarFieldEnum | GatheringScalarFieldEnum[]
  }

  /**
   * Gathering findFirstOrThrow
   */
  export type GatheringFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * Filter, which Gathering to fetch.
     */
    where?: GatheringWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gatherings to fetch.
     */
    orderBy?: GatheringOrderByWithRelationInput | GatheringOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gatherings.
     */
    cursor?: GatheringWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gatherings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gatherings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gatherings.
     */
    distinct?: GatheringScalarFieldEnum | GatheringScalarFieldEnum[]
  }

  /**
   * Gathering findMany
   */
  export type GatheringFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * Filter, which Gatherings to fetch.
     */
    where?: GatheringWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gatherings to fetch.
     */
    orderBy?: GatheringOrderByWithRelationInput | GatheringOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Gatherings.
     */
    cursor?: GatheringWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gatherings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gatherings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gatherings.
     */
    distinct?: GatheringScalarFieldEnum | GatheringScalarFieldEnum[]
  }

  /**
   * Gathering create
   */
  export type GatheringCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * The data needed to create a Gathering.
     */
    data: XOR<GatheringCreateInput, GatheringUncheckedCreateInput>
  }

  /**
   * Gathering createMany
   */
  export type GatheringCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Gatherings.
     */
    data: GatheringCreateManyInput | GatheringCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Gathering createManyAndReturn
   */
  export type GatheringCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * The data used to create many Gatherings.
     */
    data: GatheringCreateManyInput | GatheringCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Gathering update
   */
  export type GatheringUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * The data needed to update a Gathering.
     */
    data: XOR<GatheringUpdateInput, GatheringUncheckedUpdateInput>
    /**
     * Choose, which Gathering to update.
     */
    where: GatheringWhereUniqueInput
  }

  /**
   * Gathering updateMany
   */
  export type GatheringUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Gatherings.
     */
    data: XOR<GatheringUpdateManyMutationInput, GatheringUncheckedUpdateManyInput>
    /**
     * Filter which Gatherings to update
     */
    where?: GatheringWhereInput
    /**
     * Limit how many Gatherings to update.
     */
    limit?: number
  }

  /**
   * Gathering updateManyAndReturn
   */
  export type GatheringUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * The data used to update Gatherings.
     */
    data: XOR<GatheringUpdateManyMutationInput, GatheringUncheckedUpdateManyInput>
    /**
     * Filter which Gatherings to update
     */
    where?: GatheringWhereInput
    /**
     * Limit how many Gatherings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Gathering upsert
   */
  export type GatheringUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * The filter to search for the Gathering to update in case it exists.
     */
    where: GatheringWhereUniqueInput
    /**
     * In case the Gathering found by the `where` argument doesn't exist, create a new Gathering with this data.
     */
    create: XOR<GatheringCreateInput, GatheringUncheckedCreateInput>
    /**
     * In case the Gathering was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GatheringUpdateInput, GatheringUncheckedUpdateInput>
  }

  /**
   * Gathering delete
   */
  export type GatheringDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    /**
     * Filter which Gathering to delete.
     */
    where: GatheringWhereUniqueInput
  }

  /**
   * Gathering deleteMany
   */
  export type GatheringDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gatherings to delete
     */
    where?: GatheringWhereInput
    /**
     * Limit how many Gatherings to delete.
     */
    limit?: number
  }

  /**
   * Gathering.expenses
   */
  export type Gathering$expensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    where?: ExpenseWhereInput
    orderBy?: ExpenseOrderByWithRelationInput | ExpenseOrderByWithRelationInput[]
    cursor?: ExpenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExpenseScalarFieldEnum | ExpenseScalarFieldEnum[]
  }

  /**
   * Gathering.notifications
   */
  export type Gathering$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Gathering without action
   */
  export type GatheringDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
  }


  /**
   * Model Expense
   */

  export type AggregateExpense = {
    _count: ExpenseCountAggregateOutputType | null
    _avg: ExpenseAvgAggregateOutputType | null
    _sum: ExpenseSumAggregateOutputType | null
    _min: ExpenseMinAggregateOutputType | null
    _max: ExpenseMaxAggregateOutputType | null
  }

  export type ExpenseAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type ExpenseSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type ExpenseMinAggregateOutputType = {
    id: string | null
    gatheringId: string | null
    createdById: string | null
    title: string | null
    amount: Decimal | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExpenseMaxAggregateOutputType = {
    id: string | null
    gatheringId: string | null
    createdById: string | null
    title: string | null
    amount: Decimal | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExpenseCountAggregateOutputType = {
    id: number
    gatheringId: number
    createdById: number
    title: number
    amount: number
    currency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExpenseAvgAggregateInputType = {
    amount?: true
  }

  export type ExpenseSumAggregateInputType = {
    amount?: true
  }

  export type ExpenseMinAggregateInputType = {
    id?: true
    gatheringId?: true
    createdById?: true
    title?: true
    amount?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExpenseMaxAggregateInputType = {
    id?: true
    gatheringId?: true
    createdById?: true
    title?: true
    amount?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExpenseCountAggregateInputType = {
    id?: true
    gatheringId?: true
    createdById?: true
    title?: true
    amount?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExpenseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Expense to aggregate.
     */
    where?: ExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Expenses to fetch.
     */
    orderBy?: ExpenseOrderByWithRelationInput | ExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Expenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Expenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Expenses
    **/
    _count?: true | ExpenseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExpenseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExpenseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExpenseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExpenseMaxAggregateInputType
  }

  export type GetExpenseAggregateType<T extends ExpenseAggregateArgs> = {
        [P in keyof T & keyof AggregateExpense]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExpense[P]>
      : GetScalarType<T[P], AggregateExpense[P]>
  }




  export type ExpenseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpenseWhereInput
    orderBy?: ExpenseOrderByWithAggregationInput | ExpenseOrderByWithAggregationInput[]
    by: ExpenseScalarFieldEnum[] | ExpenseScalarFieldEnum
    having?: ExpenseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExpenseCountAggregateInputType | true
    _avg?: ExpenseAvgAggregateInputType
    _sum?: ExpenseSumAggregateInputType
    _min?: ExpenseMinAggregateInputType
    _max?: ExpenseMaxAggregateInputType
  }

  export type ExpenseGroupByOutputType = {
    id: string
    gatheringId: string
    createdById: string
    title: string
    amount: Decimal
    currency: string
    createdAt: Date
    updatedAt: Date
    _count: ExpenseCountAggregateOutputType | null
    _avg: ExpenseAvgAggregateOutputType | null
    _sum: ExpenseSumAggregateOutputType | null
    _min: ExpenseMinAggregateOutputType | null
    _max: ExpenseMaxAggregateOutputType | null
  }

  type GetExpenseGroupByPayload<T extends ExpenseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExpenseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExpenseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExpenseGroupByOutputType[P]>
            : GetScalarType<T[P], ExpenseGroupByOutputType[P]>
        }
      >
    >


  export type ExpenseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gatheringId?: boolean
    createdById?: boolean
    title?: boolean
    amount?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gathering?: boolean | GatheringDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
    participants?: boolean | Expense$participantsArgs<ExtArgs>
    _count?: boolean | ExpenseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expense"]>

  export type ExpenseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gatheringId?: boolean
    createdById?: boolean
    title?: boolean
    amount?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gathering?: boolean | GatheringDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expense"]>

  export type ExpenseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gatheringId?: boolean
    createdById?: boolean
    title?: boolean
    amount?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gathering?: boolean | GatheringDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expense"]>

  export type ExpenseSelectScalar = {
    id?: boolean
    gatheringId?: boolean
    createdById?: boolean
    title?: boolean
    amount?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExpenseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gatheringId" | "createdById" | "title" | "amount" | "currency" | "createdAt" | "updatedAt", ExtArgs["result"]["expense"]>
  export type ExpenseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gathering?: boolean | GatheringDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
    participants?: boolean | Expense$participantsArgs<ExtArgs>
    _count?: boolean | ExpenseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExpenseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gathering?: boolean | GatheringDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExpenseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gathering?: boolean | GatheringDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExpensePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Expense"
    objects: {
      gathering: Prisma.$GatheringPayload<ExtArgs>
      creator: Prisma.$UserPayload<ExtArgs>
      participants: Prisma.$ExpenseParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gatheringId: string
      createdById: string
      title: string
      amount: Prisma.Decimal
      currency: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["expense"]>
    composites: {}
  }

  type ExpenseGetPayload<S extends boolean | null | undefined | ExpenseDefaultArgs> = $Result.GetResult<Prisma.$ExpensePayload, S>

  type ExpenseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExpenseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExpenseCountAggregateInputType | true
    }

  export interface ExpenseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Expense'], meta: { name: 'Expense' } }
    /**
     * Find zero or one Expense that matches the filter.
     * @param {ExpenseFindUniqueArgs} args - Arguments to find a Expense
     * @example
     * // Get one Expense
     * const expense = await prisma.expense.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExpenseFindUniqueArgs>(args: SelectSubset<T, ExpenseFindUniqueArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Expense that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExpenseFindUniqueOrThrowArgs} args - Arguments to find a Expense
     * @example
     * // Get one Expense
     * const expense = await prisma.expense.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExpenseFindUniqueOrThrowArgs>(args: SelectSubset<T, ExpenseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Expense that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseFindFirstArgs} args - Arguments to find a Expense
     * @example
     * // Get one Expense
     * const expense = await prisma.expense.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExpenseFindFirstArgs>(args?: SelectSubset<T, ExpenseFindFirstArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Expense that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseFindFirstOrThrowArgs} args - Arguments to find a Expense
     * @example
     * // Get one Expense
     * const expense = await prisma.expense.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExpenseFindFirstOrThrowArgs>(args?: SelectSubset<T, ExpenseFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Expenses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Expenses
     * const expenses = await prisma.expense.findMany()
     * 
     * // Get first 10 Expenses
     * const expenses = await prisma.expense.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const expenseWithIdOnly = await prisma.expense.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExpenseFindManyArgs>(args?: SelectSubset<T, ExpenseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Expense.
     * @param {ExpenseCreateArgs} args - Arguments to create a Expense.
     * @example
     * // Create one Expense
     * const Expense = await prisma.expense.create({
     *   data: {
     *     // ... data to create a Expense
     *   }
     * })
     * 
     */
    create<T extends ExpenseCreateArgs>(args: SelectSubset<T, ExpenseCreateArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Expenses.
     * @param {ExpenseCreateManyArgs} args - Arguments to create many Expenses.
     * @example
     * // Create many Expenses
     * const expense = await prisma.expense.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExpenseCreateManyArgs>(args?: SelectSubset<T, ExpenseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Expenses and returns the data saved in the database.
     * @param {ExpenseCreateManyAndReturnArgs} args - Arguments to create many Expenses.
     * @example
     * // Create many Expenses
     * const expense = await prisma.expense.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Expenses and only return the `id`
     * const expenseWithIdOnly = await prisma.expense.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExpenseCreateManyAndReturnArgs>(args?: SelectSubset<T, ExpenseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Expense.
     * @param {ExpenseDeleteArgs} args - Arguments to delete one Expense.
     * @example
     * // Delete one Expense
     * const Expense = await prisma.expense.delete({
     *   where: {
     *     // ... filter to delete one Expense
     *   }
     * })
     * 
     */
    delete<T extends ExpenseDeleteArgs>(args: SelectSubset<T, ExpenseDeleteArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Expense.
     * @param {ExpenseUpdateArgs} args - Arguments to update one Expense.
     * @example
     * // Update one Expense
     * const expense = await prisma.expense.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExpenseUpdateArgs>(args: SelectSubset<T, ExpenseUpdateArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Expenses.
     * @param {ExpenseDeleteManyArgs} args - Arguments to filter Expenses to delete.
     * @example
     * // Delete a few Expenses
     * const { count } = await prisma.expense.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExpenseDeleteManyArgs>(args?: SelectSubset<T, ExpenseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Expenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Expenses
     * const expense = await prisma.expense.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExpenseUpdateManyArgs>(args: SelectSubset<T, ExpenseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Expenses and returns the data updated in the database.
     * @param {ExpenseUpdateManyAndReturnArgs} args - Arguments to update many Expenses.
     * @example
     * // Update many Expenses
     * const expense = await prisma.expense.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Expenses and only return the `id`
     * const expenseWithIdOnly = await prisma.expense.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExpenseUpdateManyAndReturnArgs>(args: SelectSubset<T, ExpenseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Expense.
     * @param {ExpenseUpsertArgs} args - Arguments to update or create a Expense.
     * @example
     * // Update or create a Expense
     * const expense = await prisma.expense.upsert({
     *   create: {
     *     // ... data to create a Expense
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Expense we want to update
     *   }
     * })
     */
    upsert<T extends ExpenseUpsertArgs>(args: SelectSubset<T, ExpenseUpsertArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Expenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseCountArgs} args - Arguments to filter Expenses to count.
     * @example
     * // Count the number of Expenses
     * const count = await prisma.expense.count({
     *   where: {
     *     // ... the filter for the Expenses we want to count
     *   }
     * })
    **/
    count<T extends ExpenseCountArgs>(
      args?: Subset<T, ExpenseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExpenseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Expense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExpenseAggregateArgs>(args: Subset<T, ExpenseAggregateArgs>): Prisma.PrismaPromise<GetExpenseAggregateType<T>>

    /**
     * Group by Expense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExpenseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExpenseGroupByArgs['orderBy'] }
        : { orderBy?: ExpenseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExpenseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExpenseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Expense model
   */
  readonly fields: ExpenseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Expense.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExpenseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gathering<T extends GatheringDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GatheringDefaultArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    participants<T extends Expense$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Expense$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Expense model
   */
  interface ExpenseFieldRefs {
    readonly id: FieldRef<"Expense", 'String'>
    readonly gatheringId: FieldRef<"Expense", 'String'>
    readonly createdById: FieldRef<"Expense", 'String'>
    readonly title: FieldRef<"Expense", 'String'>
    readonly amount: FieldRef<"Expense", 'Decimal'>
    readonly currency: FieldRef<"Expense", 'String'>
    readonly createdAt: FieldRef<"Expense", 'DateTime'>
    readonly updatedAt: FieldRef<"Expense", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Expense findUnique
   */
  export type ExpenseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * Filter, which Expense to fetch.
     */
    where: ExpenseWhereUniqueInput
  }

  /**
   * Expense findUniqueOrThrow
   */
  export type ExpenseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * Filter, which Expense to fetch.
     */
    where: ExpenseWhereUniqueInput
  }

  /**
   * Expense findFirst
   */
  export type ExpenseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * Filter, which Expense to fetch.
     */
    where?: ExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Expenses to fetch.
     */
    orderBy?: ExpenseOrderByWithRelationInput | ExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Expenses.
     */
    cursor?: ExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Expenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Expenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Expenses.
     */
    distinct?: ExpenseScalarFieldEnum | ExpenseScalarFieldEnum[]
  }

  /**
   * Expense findFirstOrThrow
   */
  export type ExpenseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * Filter, which Expense to fetch.
     */
    where?: ExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Expenses to fetch.
     */
    orderBy?: ExpenseOrderByWithRelationInput | ExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Expenses.
     */
    cursor?: ExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Expenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Expenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Expenses.
     */
    distinct?: ExpenseScalarFieldEnum | ExpenseScalarFieldEnum[]
  }

  /**
   * Expense findMany
   */
  export type ExpenseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * Filter, which Expenses to fetch.
     */
    where?: ExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Expenses to fetch.
     */
    orderBy?: ExpenseOrderByWithRelationInput | ExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Expenses.
     */
    cursor?: ExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Expenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Expenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Expenses.
     */
    distinct?: ExpenseScalarFieldEnum | ExpenseScalarFieldEnum[]
  }

  /**
   * Expense create
   */
  export type ExpenseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * The data needed to create a Expense.
     */
    data: XOR<ExpenseCreateInput, ExpenseUncheckedCreateInput>
  }

  /**
   * Expense createMany
   */
  export type ExpenseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Expenses.
     */
    data: ExpenseCreateManyInput | ExpenseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Expense createManyAndReturn
   */
  export type ExpenseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * The data used to create many Expenses.
     */
    data: ExpenseCreateManyInput | ExpenseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Expense update
   */
  export type ExpenseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * The data needed to update a Expense.
     */
    data: XOR<ExpenseUpdateInput, ExpenseUncheckedUpdateInput>
    /**
     * Choose, which Expense to update.
     */
    where: ExpenseWhereUniqueInput
  }

  /**
   * Expense updateMany
   */
  export type ExpenseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Expenses.
     */
    data: XOR<ExpenseUpdateManyMutationInput, ExpenseUncheckedUpdateManyInput>
    /**
     * Filter which Expenses to update
     */
    where?: ExpenseWhereInput
    /**
     * Limit how many Expenses to update.
     */
    limit?: number
  }

  /**
   * Expense updateManyAndReturn
   */
  export type ExpenseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * The data used to update Expenses.
     */
    data: XOR<ExpenseUpdateManyMutationInput, ExpenseUncheckedUpdateManyInput>
    /**
     * Filter which Expenses to update
     */
    where?: ExpenseWhereInput
    /**
     * Limit how many Expenses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Expense upsert
   */
  export type ExpenseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * The filter to search for the Expense to update in case it exists.
     */
    where: ExpenseWhereUniqueInput
    /**
     * In case the Expense found by the `where` argument doesn't exist, create a new Expense with this data.
     */
    create: XOR<ExpenseCreateInput, ExpenseUncheckedCreateInput>
    /**
     * In case the Expense was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExpenseUpdateInput, ExpenseUncheckedUpdateInput>
  }

  /**
   * Expense delete
   */
  export type ExpenseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
    /**
     * Filter which Expense to delete.
     */
    where: ExpenseWhereUniqueInput
  }

  /**
   * Expense deleteMany
   */
  export type ExpenseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Expenses to delete
     */
    where?: ExpenseWhereInput
    /**
     * Limit how many Expenses to delete.
     */
    limit?: number
  }

  /**
   * Expense.participants
   */
  export type Expense$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    where?: ExpenseParticipantWhereInput
    orderBy?: ExpenseParticipantOrderByWithRelationInput | ExpenseParticipantOrderByWithRelationInput[]
    cursor?: ExpenseParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExpenseParticipantScalarFieldEnum | ExpenseParticipantScalarFieldEnum[]
  }

  /**
   * Expense without action
   */
  export type ExpenseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: ExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expense
     */
    omit?: ExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseInclude<ExtArgs> | null
  }


  /**
   * Model ExpenseParticipant
   */

  export type AggregateExpenseParticipant = {
    _count: ExpenseParticipantCountAggregateOutputType | null
    _min: ExpenseParticipantMinAggregateOutputType | null
    _max: ExpenseParticipantMaxAggregateOutputType | null
  }

  export type ExpenseParticipantMinAggregateOutputType = {
    id: string | null
    expenseId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type ExpenseParticipantMaxAggregateOutputType = {
    id: string | null
    expenseId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type ExpenseParticipantCountAggregateOutputType = {
    id: number
    expenseId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type ExpenseParticipantMinAggregateInputType = {
    id?: true
    expenseId?: true
    userId?: true
    createdAt?: true
  }

  export type ExpenseParticipantMaxAggregateInputType = {
    id?: true
    expenseId?: true
    userId?: true
    createdAt?: true
  }

  export type ExpenseParticipantCountAggregateInputType = {
    id?: true
    expenseId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type ExpenseParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExpenseParticipant to aggregate.
     */
    where?: ExpenseParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpenseParticipants to fetch.
     */
    orderBy?: ExpenseParticipantOrderByWithRelationInput | ExpenseParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExpenseParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpenseParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpenseParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExpenseParticipants
    **/
    _count?: true | ExpenseParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExpenseParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExpenseParticipantMaxAggregateInputType
  }

  export type GetExpenseParticipantAggregateType<T extends ExpenseParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateExpenseParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExpenseParticipant[P]>
      : GetScalarType<T[P], AggregateExpenseParticipant[P]>
  }




  export type ExpenseParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpenseParticipantWhereInput
    orderBy?: ExpenseParticipantOrderByWithAggregationInput | ExpenseParticipantOrderByWithAggregationInput[]
    by: ExpenseParticipantScalarFieldEnum[] | ExpenseParticipantScalarFieldEnum
    having?: ExpenseParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExpenseParticipantCountAggregateInputType | true
    _min?: ExpenseParticipantMinAggregateInputType
    _max?: ExpenseParticipantMaxAggregateInputType
  }

  export type ExpenseParticipantGroupByOutputType = {
    id: string
    expenseId: string
    userId: string
    createdAt: Date
    _count: ExpenseParticipantCountAggregateOutputType | null
    _min: ExpenseParticipantMinAggregateOutputType | null
    _max: ExpenseParticipantMaxAggregateOutputType | null
  }

  type GetExpenseParticipantGroupByPayload<T extends ExpenseParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExpenseParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExpenseParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExpenseParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], ExpenseParticipantGroupByOutputType[P]>
        }
      >
    >


  export type ExpenseParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expenseId?: boolean
    userId?: boolean
    createdAt?: boolean
    expense?: boolean | ExpenseDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expenseParticipant"]>

  export type ExpenseParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expenseId?: boolean
    userId?: boolean
    createdAt?: boolean
    expense?: boolean | ExpenseDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expenseParticipant"]>

  export type ExpenseParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expenseId?: boolean
    userId?: boolean
    createdAt?: boolean
    expense?: boolean | ExpenseDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expenseParticipant"]>

  export type ExpenseParticipantSelectScalar = {
    id?: boolean
    expenseId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type ExpenseParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expenseId" | "userId" | "createdAt", ExtArgs["result"]["expenseParticipant"]>
  export type ExpenseParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    expense?: boolean | ExpenseDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExpenseParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    expense?: boolean | ExpenseDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExpenseParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    expense?: boolean | ExpenseDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExpenseParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExpenseParticipant"
    objects: {
      expense: Prisma.$ExpensePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expenseId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["expenseParticipant"]>
    composites: {}
  }

  type ExpenseParticipantGetPayload<S extends boolean | null | undefined | ExpenseParticipantDefaultArgs> = $Result.GetResult<Prisma.$ExpenseParticipantPayload, S>

  type ExpenseParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExpenseParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExpenseParticipantCountAggregateInputType | true
    }

  export interface ExpenseParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExpenseParticipant'], meta: { name: 'ExpenseParticipant' } }
    /**
     * Find zero or one ExpenseParticipant that matches the filter.
     * @param {ExpenseParticipantFindUniqueArgs} args - Arguments to find a ExpenseParticipant
     * @example
     * // Get one ExpenseParticipant
     * const expenseParticipant = await prisma.expenseParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExpenseParticipantFindUniqueArgs>(args: SelectSubset<T, ExpenseParticipantFindUniqueArgs<ExtArgs>>): Prisma__ExpenseParticipantClient<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExpenseParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExpenseParticipantFindUniqueOrThrowArgs} args - Arguments to find a ExpenseParticipant
     * @example
     * // Get one ExpenseParticipant
     * const expenseParticipant = await prisma.expenseParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExpenseParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, ExpenseParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExpenseParticipantClient<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExpenseParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseParticipantFindFirstArgs} args - Arguments to find a ExpenseParticipant
     * @example
     * // Get one ExpenseParticipant
     * const expenseParticipant = await prisma.expenseParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExpenseParticipantFindFirstArgs>(args?: SelectSubset<T, ExpenseParticipantFindFirstArgs<ExtArgs>>): Prisma__ExpenseParticipantClient<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExpenseParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseParticipantFindFirstOrThrowArgs} args - Arguments to find a ExpenseParticipant
     * @example
     * // Get one ExpenseParticipant
     * const expenseParticipant = await prisma.expenseParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExpenseParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, ExpenseParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExpenseParticipantClient<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExpenseParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExpenseParticipants
     * const expenseParticipants = await prisma.expenseParticipant.findMany()
     * 
     * // Get first 10 ExpenseParticipants
     * const expenseParticipants = await prisma.expenseParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const expenseParticipantWithIdOnly = await prisma.expenseParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExpenseParticipantFindManyArgs>(args?: SelectSubset<T, ExpenseParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExpenseParticipant.
     * @param {ExpenseParticipantCreateArgs} args - Arguments to create a ExpenseParticipant.
     * @example
     * // Create one ExpenseParticipant
     * const ExpenseParticipant = await prisma.expenseParticipant.create({
     *   data: {
     *     // ... data to create a ExpenseParticipant
     *   }
     * })
     * 
     */
    create<T extends ExpenseParticipantCreateArgs>(args: SelectSubset<T, ExpenseParticipantCreateArgs<ExtArgs>>): Prisma__ExpenseParticipantClient<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExpenseParticipants.
     * @param {ExpenseParticipantCreateManyArgs} args - Arguments to create many ExpenseParticipants.
     * @example
     * // Create many ExpenseParticipants
     * const expenseParticipant = await prisma.expenseParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExpenseParticipantCreateManyArgs>(args?: SelectSubset<T, ExpenseParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExpenseParticipants and returns the data saved in the database.
     * @param {ExpenseParticipantCreateManyAndReturnArgs} args - Arguments to create many ExpenseParticipants.
     * @example
     * // Create many ExpenseParticipants
     * const expenseParticipant = await prisma.expenseParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExpenseParticipants and only return the `id`
     * const expenseParticipantWithIdOnly = await prisma.expenseParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExpenseParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, ExpenseParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExpenseParticipant.
     * @param {ExpenseParticipantDeleteArgs} args - Arguments to delete one ExpenseParticipant.
     * @example
     * // Delete one ExpenseParticipant
     * const ExpenseParticipant = await prisma.expenseParticipant.delete({
     *   where: {
     *     // ... filter to delete one ExpenseParticipant
     *   }
     * })
     * 
     */
    delete<T extends ExpenseParticipantDeleteArgs>(args: SelectSubset<T, ExpenseParticipantDeleteArgs<ExtArgs>>): Prisma__ExpenseParticipantClient<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExpenseParticipant.
     * @param {ExpenseParticipantUpdateArgs} args - Arguments to update one ExpenseParticipant.
     * @example
     * // Update one ExpenseParticipant
     * const expenseParticipant = await prisma.expenseParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExpenseParticipantUpdateArgs>(args: SelectSubset<T, ExpenseParticipantUpdateArgs<ExtArgs>>): Prisma__ExpenseParticipantClient<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExpenseParticipants.
     * @param {ExpenseParticipantDeleteManyArgs} args - Arguments to filter ExpenseParticipants to delete.
     * @example
     * // Delete a few ExpenseParticipants
     * const { count } = await prisma.expenseParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExpenseParticipantDeleteManyArgs>(args?: SelectSubset<T, ExpenseParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExpenseParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExpenseParticipants
     * const expenseParticipant = await prisma.expenseParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExpenseParticipantUpdateManyArgs>(args: SelectSubset<T, ExpenseParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExpenseParticipants and returns the data updated in the database.
     * @param {ExpenseParticipantUpdateManyAndReturnArgs} args - Arguments to update many ExpenseParticipants.
     * @example
     * // Update many ExpenseParticipants
     * const expenseParticipant = await prisma.expenseParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExpenseParticipants and only return the `id`
     * const expenseParticipantWithIdOnly = await prisma.expenseParticipant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExpenseParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, ExpenseParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExpenseParticipant.
     * @param {ExpenseParticipantUpsertArgs} args - Arguments to update or create a ExpenseParticipant.
     * @example
     * // Update or create a ExpenseParticipant
     * const expenseParticipant = await prisma.expenseParticipant.upsert({
     *   create: {
     *     // ... data to create a ExpenseParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExpenseParticipant we want to update
     *   }
     * })
     */
    upsert<T extends ExpenseParticipantUpsertArgs>(args: SelectSubset<T, ExpenseParticipantUpsertArgs<ExtArgs>>): Prisma__ExpenseParticipantClient<$Result.GetResult<Prisma.$ExpenseParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExpenseParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseParticipantCountArgs} args - Arguments to filter ExpenseParticipants to count.
     * @example
     * // Count the number of ExpenseParticipants
     * const count = await prisma.expenseParticipant.count({
     *   where: {
     *     // ... the filter for the ExpenseParticipants we want to count
     *   }
     * })
    **/
    count<T extends ExpenseParticipantCountArgs>(
      args?: Subset<T, ExpenseParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExpenseParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExpenseParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExpenseParticipantAggregateArgs>(args: Subset<T, ExpenseParticipantAggregateArgs>): Prisma.PrismaPromise<GetExpenseParticipantAggregateType<T>>

    /**
     * Group by ExpenseParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpenseParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExpenseParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExpenseParticipantGroupByArgs['orderBy'] }
        : { orderBy?: ExpenseParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExpenseParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExpenseParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExpenseParticipant model
   */
  readonly fields: ExpenseParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExpenseParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExpenseParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    expense<T extends ExpenseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExpenseDefaultArgs<ExtArgs>>): Prisma__ExpenseClient<$Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExpenseParticipant model
   */
  interface ExpenseParticipantFieldRefs {
    readonly id: FieldRef<"ExpenseParticipant", 'String'>
    readonly expenseId: FieldRef<"ExpenseParticipant", 'String'>
    readonly userId: FieldRef<"ExpenseParticipant", 'String'>
    readonly createdAt: FieldRef<"ExpenseParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExpenseParticipant findUnique
   */
  export type ExpenseParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ExpenseParticipant to fetch.
     */
    where: ExpenseParticipantWhereUniqueInput
  }

  /**
   * ExpenseParticipant findUniqueOrThrow
   */
  export type ExpenseParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ExpenseParticipant to fetch.
     */
    where: ExpenseParticipantWhereUniqueInput
  }

  /**
   * ExpenseParticipant findFirst
   */
  export type ExpenseParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ExpenseParticipant to fetch.
     */
    where?: ExpenseParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpenseParticipants to fetch.
     */
    orderBy?: ExpenseParticipantOrderByWithRelationInput | ExpenseParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExpenseParticipants.
     */
    cursor?: ExpenseParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpenseParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpenseParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExpenseParticipants.
     */
    distinct?: ExpenseParticipantScalarFieldEnum | ExpenseParticipantScalarFieldEnum[]
  }

  /**
   * ExpenseParticipant findFirstOrThrow
   */
  export type ExpenseParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ExpenseParticipant to fetch.
     */
    where?: ExpenseParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpenseParticipants to fetch.
     */
    orderBy?: ExpenseParticipantOrderByWithRelationInput | ExpenseParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExpenseParticipants.
     */
    cursor?: ExpenseParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpenseParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpenseParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExpenseParticipants.
     */
    distinct?: ExpenseParticipantScalarFieldEnum | ExpenseParticipantScalarFieldEnum[]
  }

  /**
   * ExpenseParticipant findMany
   */
  export type ExpenseParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ExpenseParticipants to fetch.
     */
    where?: ExpenseParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpenseParticipants to fetch.
     */
    orderBy?: ExpenseParticipantOrderByWithRelationInput | ExpenseParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExpenseParticipants.
     */
    cursor?: ExpenseParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpenseParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpenseParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExpenseParticipants.
     */
    distinct?: ExpenseParticipantScalarFieldEnum | ExpenseParticipantScalarFieldEnum[]
  }

  /**
   * ExpenseParticipant create
   */
  export type ExpenseParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a ExpenseParticipant.
     */
    data: XOR<ExpenseParticipantCreateInput, ExpenseParticipantUncheckedCreateInput>
  }

  /**
   * ExpenseParticipant createMany
   */
  export type ExpenseParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExpenseParticipants.
     */
    data: ExpenseParticipantCreateManyInput | ExpenseParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExpenseParticipant createManyAndReturn
   */
  export type ExpenseParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many ExpenseParticipants.
     */
    data: ExpenseParticipantCreateManyInput | ExpenseParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExpenseParticipant update
   */
  export type ExpenseParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a ExpenseParticipant.
     */
    data: XOR<ExpenseParticipantUpdateInput, ExpenseParticipantUncheckedUpdateInput>
    /**
     * Choose, which ExpenseParticipant to update.
     */
    where: ExpenseParticipantWhereUniqueInput
  }

  /**
   * ExpenseParticipant updateMany
   */
  export type ExpenseParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExpenseParticipants.
     */
    data: XOR<ExpenseParticipantUpdateManyMutationInput, ExpenseParticipantUncheckedUpdateManyInput>
    /**
     * Filter which ExpenseParticipants to update
     */
    where?: ExpenseParticipantWhereInput
    /**
     * Limit how many ExpenseParticipants to update.
     */
    limit?: number
  }

  /**
   * ExpenseParticipant updateManyAndReturn
   */
  export type ExpenseParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * The data used to update ExpenseParticipants.
     */
    data: XOR<ExpenseParticipantUpdateManyMutationInput, ExpenseParticipantUncheckedUpdateManyInput>
    /**
     * Filter which ExpenseParticipants to update
     */
    where?: ExpenseParticipantWhereInput
    /**
     * Limit how many ExpenseParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExpenseParticipant upsert
   */
  export type ExpenseParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the ExpenseParticipant to update in case it exists.
     */
    where: ExpenseParticipantWhereUniqueInput
    /**
     * In case the ExpenseParticipant found by the `where` argument doesn't exist, create a new ExpenseParticipant with this data.
     */
    create: XOR<ExpenseParticipantCreateInput, ExpenseParticipantUncheckedCreateInput>
    /**
     * In case the ExpenseParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExpenseParticipantUpdateInput, ExpenseParticipantUncheckedUpdateInput>
  }

  /**
   * ExpenseParticipant delete
   */
  export type ExpenseParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
    /**
     * Filter which ExpenseParticipant to delete.
     */
    where: ExpenseParticipantWhereUniqueInput
  }

  /**
   * ExpenseParticipant deleteMany
   */
  export type ExpenseParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExpenseParticipants to delete
     */
    where?: ExpenseParticipantWhereInput
    /**
     * Limit how many ExpenseParticipants to delete.
     */
    limit?: number
  }

  /**
   * ExpenseParticipant without action
   */
  export type ExpenseParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpenseParticipant
     */
    select?: ExpenseParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpenseParticipant
     */
    omit?: ExpenseParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpenseParticipantInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.NotificationType | null
    title: string | null
    body: string | null
    read: boolean | null
    relatedTransactionId: string | null
    relatedFriendshipId: string | null
    relatedGatheringId: string | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.NotificationType | null
    title: string | null
    body: string | null
    read: boolean | null
    relatedTransactionId: string | null
    relatedFriendshipId: string | null
    relatedGatheringId: string | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    title: number
    body: number
    read: number
    relatedTransactionId: number
    relatedFriendshipId: number
    relatedGatheringId: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    body?: true
    read?: true
    relatedTransactionId?: true
    relatedFriendshipId?: true
    relatedGatheringId?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    body?: true
    read?: true
    relatedTransactionId?: true
    relatedFriendshipId?: true
    relatedGatheringId?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    body?: true
    read?: true
    relatedTransactionId?: true
    relatedFriendshipId?: true
    relatedGatheringId?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read: boolean
    relatedTransactionId: string | null
    relatedFriendshipId: string | null
    relatedGatheringId: string | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    read?: boolean
    relatedTransactionId?: boolean
    relatedFriendshipId?: boolean
    relatedGatheringId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    relatedTransaction?: boolean | Notification$relatedTransactionArgs<ExtArgs>
    relatedFriendship?: boolean | Notification$relatedFriendshipArgs<ExtArgs>
    relatedGathering?: boolean | Notification$relatedGatheringArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    read?: boolean
    relatedTransactionId?: boolean
    relatedFriendshipId?: boolean
    relatedGatheringId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    relatedTransaction?: boolean | Notification$relatedTransactionArgs<ExtArgs>
    relatedFriendship?: boolean | Notification$relatedFriendshipArgs<ExtArgs>
    relatedGathering?: boolean | Notification$relatedGatheringArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    read?: boolean
    relatedTransactionId?: boolean
    relatedFriendshipId?: boolean
    relatedGatheringId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    relatedTransaction?: boolean | Notification$relatedTransactionArgs<ExtArgs>
    relatedFriendship?: boolean | Notification$relatedFriendshipArgs<ExtArgs>
    relatedGathering?: boolean | Notification$relatedGatheringArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    read?: boolean
    relatedTransactionId?: boolean
    relatedFriendshipId?: boolean
    relatedGatheringId?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "title" | "body" | "read" | "relatedTransactionId" | "relatedFriendshipId" | "relatedGatheringId" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    relatedTransaction?: boolean | Notification$relatedTransactionArgs<ExtArgs>
    relatedFriendship?: boolean | Notification$relatedFriendshipArgs<ExtArgs>
    relatedGathering?: boolean | Notification$relatedGatheringArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    relatedTransaction?: boolean | Notification$relatedTransactionArgs<ExtArgs>
    relatedFriendship?: boolean | Notification$relatedFriendshipArgs<ExtArgs>
    relatedGathering?: boolean | Notification$relatedGatheringArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    relatedTransaction?: boolean | Notification$relatedTransactionArgs<ExtArgs>
    relatedFriendship?: boolean | Notification$relatedFriendshipArgs<ExtArgs>
    relatedGathering?: boolean | Notification$relatedGatheringArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      relatedTransaction: Prisma.$TransactionPayload<ExtArgs> | null
      relatedFriendship: Prisma.$FriendshipPayload<ExtArgs> | null
      relatedGathering: Prisma.$GatheringPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: $Enums.NotificationType
      title: string
      body: string
      read: boolean
      relatedTransactionId: string | null
      relatedFriendshipId: string | null
      relatedGatheringId: string | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    relatedTransaction<T extends Notification$relatedTransactionArgs<ExtArgs> = {}>(args?: Subset<T, Notification$relatedTransactionArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    relatedFriendship<T extends Notification$relatedFriendshipArgs<ExtArgs> = {}>(args?: Subset<T, Notification$relatedFriendshipArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    relatedGathering<T extends Notification$relatedGatheringArgs<ExtArgs> = {}>(args?: Subset<T, Notification$relatedGatheringArgs<ExtArgs>>): Prisma__GatheringClient<$Result.GetResult<Prisma.$GatheringPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'NotificationType'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly body: FieldRef<"Notification", 'String'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly relatedTransactionId: FieldRef<"Notification", 'String'>
    readonly relatedFriendshipId: FieldRef<"Notification", 'String'>
    readonly relatedGatheringId: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.relatedTransaction
   */
  export type Notification$relatedTransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
  }

  /**
   * Notification.relatedFriendship
   */
  export type Notification$relatedFriendshipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
  }

  /**
   * Notification.relatedGathering
   */
  export type Notification$relatedGatheringArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gathering
     */
    select?: GatheringSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gathering
     */
    omit?: GatheringOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GatheringInclude<ExtArgs> | null
    where?: GatheringWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    username: 'username',
    email: 'email',
    password: 'password',
    avatar: 'avatar',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const FriendshipScalarFieldEnum: {
    id: 'id',
    requesterId: 'requesterId',
    addresseeId: 'addresseeId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FriendshipScalarFieldEnum = (typeof FriendshipScalarFieldEnum)[keyof typeof FriendshipScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    creatorId: 'creatorId',
    debtorId: 'debtorId',
    creditorId: 'creditorId',
    amount: 'amount',
    currency: 'currency',
    description: 'description',
    type: 'type',
    status: 'status',
    pendingConfirmationFromId: 'pendingConfirmationFromId',
    occurredAt: 'occurredAt',
    confirmedAt: 'confirmedAt',
    rejectedAt: 'rejectedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const GatheringScalarFieldEnum: {
    id: 'id',
    creatorId: 'creatorId',
    name: 'name',
    description: 'description',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GatheringScalarFieldEnum = (typeof GatheringScalarFieldEnum)[keyof typeof GatheringScalarFieldEnum]


  export const ExpenseScalarFieldEnum: {
    id: 'id',
    gatheringId: 'gatheringId',
    createdById: 'createdById',
    title: 'title',
    amount: 'amount',
    currency: 'currency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExpenseScalarFieldEnum = (typeof ExpenseScalarFieldEnum)[keyof typeof ExpenseScalarFieldEnum]


  export const ExpenseParticipantScalarFieldEnum: {
    id: 'id',
    expenseId: 'expenseId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type ExpenseParticipantScalarFieldEnum = (typeof ExpenseParticipantScalarFieldEnum)[keyof typeof ExpenseParticipantScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    body: 'body',
    read: 'read',
    relatedTransactionId: 'relatedTransactionId',
    relatedFriendshipId: 'relatedFriendshipId',
    relatedGatheringId: 'relatedGatheringId',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'FriendshipStatus'
   */
  export type EnumFriendshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendshipStatus'>
    


  /**
   * Reference to a field of type 'FriendshipStatus[]'
   */
  export type ListEnumFriendshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendshipStatus[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'TransactionType'
   */
  export type EnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType'>
    


  /**
   * Reference to a field of type 'TransactionType[]'
   */
  export type ListEnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType[]'>
    


  /**
   * Reference to a field of type 'TransactionStatus'
   */
  export type EnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus'>
    


  /**
   * Reference to a field of type 'TransactionStatus[]'
   */
  export type ListEnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus[]'>
    


  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>
    


  /**
   * Reference to a field of type 'NotificationType[]'
   */
  export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    friendshipsSent?: FriendshipListRelationFilter
    friendshipsReceived?: FriendshipListRelationFilter
    transactionsCreated?: TransactionListRelationFilter
    transactionsDebtor?: TransactionListRelationFilter
    transactionsCreditor?: TransactionListRelationFilter
    transactionsToConfirm?: TransactionListRelationFilter
    gatherings?: GatheringListRelationFilter
    expensesCreated?: ExpenseListRelationFilter
    expenseParticipations?: ExpenseParticipantListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    friendshipsSent?: FriendshipOrderByRelationAggregateInput
    friendshipsReceived?: FriendshipOrderByRelationAggregateInput
    transactionsCreated?: TransactionOrderByRelationAggregateInput
    transactionsDebtor?: TransactionOrderByRelationAggregateInput
    transactionsCreditor?: TransactionOrderByRelationAggregateInput
    transactionsToConfirm?: TransactionOrderByRelationAggregateInput
    gatherings?: GatheringOrderByRelationAggregateInput
    expensesCreated?: ExpenseOrderByRelationAggregateInput
    expenseParticipations?: ExpenseParticipantOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    friendshipsSent?: FriendshipListRelationFilter
    friendshipsReceived?: FriendshipListRelationFilter
    transactionsCreated?: TransactionListRelationFilter
    transactionsDebtor?: TransactionListRelationFilter
    transactionsCreditor?: TransactionListRelationFilter
    transactionsToConfirm?: TransactionListRelationFilter
    gatherings?: GatheringListRelationFilter
    expensesCreated?: ExpenseListRelationFilter
    expenseParticipations?: ExpenseParticipantListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type FriendshipWhereInput = {
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    id?: StringFilter<"Friendship"> | string
    requesterId?: StringFilter<"Friendship"> | string
    addresseeId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
    requester?: XOR<UserScalarRelationFilter, UserWhereInput>
    addressee?: XOR<UserScalarRelationFilter, UserWhereInput>
    notifications?: NotificationListRelationFilter
  }

  export type FriendshipOrderByWithRelationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requester?: UserOrderByWithRelationInput
    addressee?: UserOrderByWithRelationInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type FriendshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    requesterId_addresseeId?: FriendshipRequesterIdAddresseeIdCompoundUniqueInput
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    requesterId?: StringFilter<"Friendship"> | string
    addresseeId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
    requester?: XOR<UserScalarRelationFilter, UserWhereInput>
    addressee?: XOR<UserScalarRelationFilter, UserWhereInput>
    notifications?: NotificationListRelationFilter
  }, "id" | "requesterId_addresseeId">

  export type FriendshipOrderByWithAggregationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FriendshipCountOrderByAggregateInput
    _max?: FriendshipMaxOrderByAggregateInput
    _min?: FriendshipMinOrderByAggregateInput
  }

  export type FriendshipScalarWhereWithAggregatesInput = {
    AND?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    OR?: FriendshipScalarWhereWithAggregatesInput[]
    NOT?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Friendship"> | string
    requesterId?: StringWithAggregatesFilter<"Friendship"> | string
    addresseeId?: StringWithAggregatesFilter<"Friendship"> | string
    status?: EnumFriendshipStatusWithAggregatesFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    creatorId?: StringFilter<"Transaction"> | string
    debtorId?: StringFilter<"Transaction"> | string
    creditorId?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Transaction"> | string
    description?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFilter<"Transaction"> | string
    occurredAt?: DateTimeFilter<"Transaction"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    debtor?: XOR<UserScalarRelationFilter, UserWhereInput>
    creditor?: XOR<UserScalarRelationFilter, UserWhereInput>
    confirmationFrom?: XOR<UserScalarRelationFilter, UserWhereInput>
    notifications?: NotificationListRelationFilter
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    creatorId?: SortOrder
    debtorId?: SortOrder
    creditorId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    pendingConfirmationFromId?: SortOrder
    occurredAt?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    creator?: UserOrderByWithRelationInput
    debtor?: UserOrderByWithRelationInput
    creditor?: UserOrderByWithRelationInput
    confirmationFrom?: UserOrderByWithRelationInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    creatorId?: StringFilter<"Transaction"> | string
    debtorId?: StringFilter<"Transaction"> | string
    creditorId?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Transaction"> | string
    description?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFilter<"Transaction"> | string
    occurredAt?: DateTimeFilter<"Transaction"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    debtor?: XOR<UserScalarRelationFilter, UserWhereInput>
    creditor?: XOR<UserScalarRelationFilter, UserWhereInput>
    confirmationFrom?: XOR<UserScalarRelationFilter, UserWhereInput>
    notifications?: NotificationListRelationFilter
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    creatorId?: SortOrder
    debtorId?: SortOrder
    creditorId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    pendingConfirmationFromId?: SortOrder
    occurredAt?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    creatorId?: StringWithAggregatesFilter<"Transaction"> | string
    debtorId?: StringWithAggregatesFilter<"Transaction"> | string
    creditorId?: StringWithAggregatesFilter<"Transaction"> | string
    amount?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Transaction"> | string
    description?: StringWithAggregatesFilter<"Transaction"> | string
    type?: EnumTransactionTypeWithAggregatesFilter<"Transaction"> | $Enums.TransactionType
    status?: EnumTransactionStatusWithAggregatesFilter<"Transaction"> | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringWithAggregatesFilter<"Transaction"> | string
    occurredAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    confirmedAt?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    rejectedAt?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type GatheringWhereInput = {
    AND?: GatheringWhereInput | GatheringWhereInput[]
    OR?: GatheringWhereInput[]
    NOT?: GatheringWhereInput | GatheringWhereInput[]
    id?: StringFilter<"Gathering"> | string
    creatorId?: StringFilter<"Gathering"> | string
    name?: StringFilter<"Gathering"> | string
    description?: StringNullableFilter<"Gathering"> | string | null
    date?: DateTimeFilter<"Gathering"> | Date | string
    createdAt?: DateTimeFilter<"Gathering"> | Date | string
    updatedAt?: DateTimeFilter<"Gathering"> | Date | string
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    expenses?: ExpenseListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type GatheringOrderByWithRelationInput = {
    id?: SortOrder
    creatorId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    creator?: UserOrderByWithRelationInput
    expenses?: ExpenseOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type GatheringWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GatheringWhereInput | GatheringWhereInput[]
    OR?: GatheringWhereInput[]
    NOT?: GatheringWhereInput | GatheringWhereInput[]
    creatorId?: StringFilter<"Gathering"> | string
    name?: StringFilter<"Gathering"> | string
    description?: StringNullableFilter<"Gathering"> | string | null
    date?: DateTimeFilter<"Gathering"> | Date | string
    createdAt?: DateTimeFilter<"Gathering"> | Date | string
    updatedAt?: DateTimeFilter<"Gathering"> | Date | string
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    expenses?: ExpenseListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id">

  export type GatheringOrderByWithAggregationInput = {
    id?: SortOrder
    creatorId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GatheringCountOrderByAggregateInput
    _max?: GatheringMaxOrderByAggregateInput
    _min?: GatheringMinOrderByAggregateInput
  }

  export type GatheringScalarWhereWithAggregatesInput = {
    AND?: GatheringScalarWhereWithAggregatesInput | GatheringScalarWhereWithAggregatesInput[]
    OR?: GatheringScalarWhereWithAggregatesInput[]
    NOT?: GatheringScalarWhereWithAggregatesInput | GatheringScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Gathering"> | string
    creatorId?: StringWithAggregatesFilter<"Gathering"> | string
    name?: StringWithAggregatesFilter<"Gathering"> | string
    description?: StringNullableWithAggregatesFilter<"Gathering"> | string | null
    date?: DateTimeWithAggregatesFilter<"Gathering"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Gathering"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Gathering"> | Date | string
  }

  export type ExpenseWhereInput = {
    AND?: ExpenseWhereInput | ExpenseWhereInput[]
    OR?: ExpenseWhereInput[]
    NOT?: ExpenseWhereInput | ExpenseWhereInput[]
    id?: StringFilter<"Expense"> | string
    gatheringId?: StringFilter<"Expense"> | string
    createdById?: StringFilter<"Expense"> | string
    title?: StringFilter<"Expense"> | string
    amount?: DecimalFilter<"Expense"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Expense"> | string
    createdAt?: DateTimeFilter<"Expense"> | Date | string
    updatedAt?: DateTimeFilter<"Expense"> | Date | string
    gathering?: XOR<GatheringScalarRelationFilter, GatheringWhereInput>
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    participants?: ExpenseParticipantListRelationFilter
  }

  export type ExpenseOrderByWithRelationInput = {
    id?: SortOrder
    gatheringId?: SortOrder
    createdById?: SortOrder
    title?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gathering?: GatheringOrderByWithRelationInput
    creator?: UserOrderByWithRelationInput
    participants?: ExpenseParticipantOrderByRelationAggregateInput
  }

  export type ExpenseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExpenseWhereInput | ExpenseWhereInput[]
    OR?: ExpenseWhereInput[]
    NOT?: ExpenseWhereInput | ExpenseWhereInput[]
    gatheringId?: StringFilter<"Expense"> | string
    createdById?: StringFilter<"Expense"> | string
    title?: StringFilter<"Expense"> | string
    amount?: DecimalFilter<"Expense"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Expense"> | string
    createdAt?: DateTimeFilter<"Expense"> | Date | string
    updatedAt?: DateTimeFilter<"Expense"> | Date | string
    gathering?: XOR<GatheringScalarRelationFilter, GatheringWhereInput>
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    participants?: ExpenseParticipantListRelationFilter
  }, "id">

  export type ExpenseOrderByWithAggregationInput = {
    id?: SortOrder
    gatheringId?: SortOrder
    createdById?: SortOrder
    title?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExpenseCountOrderByAggregateInput
    _avg?: ExpenseAvgOrderByAggregateInput
    _max?: ExpenseMaxOrderByAggregateInput
    _min?: ExpenseMinOrderByAggregateInput
    _sum?: ExpenseSumOrderByAggregateInput
  }

  export type ExpenseScalarWhereWithAggregatesInput = {
    AND?: ExpenseScalarWhereWithAggregatesInput | ExpenseScalarWhereWithAggregatesInput[]
    OR?: ExpenseScalarWhereWithAggregatesInput[]
    NOT?: ExpenseScalarWhereWithAggregatesInput | ExpenseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Expense"> | string
    gatheringId?: StringWithAggregatesFilter<"Expense"> | string
    createdById?: StringWithAggregatesFilter<"Expense"> | string
    title?: StringWithAggregatesFilter<"Expense"> | string
    amount?: DecimalWithAggregatesFilter<"Expense"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Expense"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Expense"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Expense"> | Date | string
  }

  export type ExpenseParticipantWhereInput = {
    AND?: ExpenseParticipantWhereInput | ExpenseParticipantWhereInput[]
    OR?: ExpenseParticipantWhereInput[]
    NOT?: ExpenseParticipantWhereInput | ExpenseParticipantWhereInput[]
    id?: StringFilter<"ExpenseParticipant"> | string
    expenseId?: StringFilter<"ExpenseParticipant"> | string
    userId?: StringFilter<"ExpenseParticipant"> | string
    createdAt?: DateTimeFilter<"ExpenseParticipant"> | Date | string
    expense?: XOR<ExpenseScalarRelationFilter, ExpenseWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ExpenseParticipantOrderByWithRelationInput = {
    id?: SortOrder
    expenseId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    expense?: ExpenseOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ExpenseParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    expenseId_userId?: ExpenseParticipantExpenseIdUserIdCompoundUniqueInput
    AND?: ExpenseParticipantWhereInput | ExpenseParticipantWhereInput[]
    OR?: ExpenseParticipantWhereInput[]
    NOT?: ExpenseParticipantWhereInput | ExpenseParticipantWhereInput[]
    expenseId?: StringFilter<"ExpenseParticipant"> | string
    userId?: StringFilter<"ExpenseParticipant"> | string
    createdAt?: DateTimeFilter<"ExpenseParticipant"> | Date | string
    expense?: XOR<ExpenseScalarRelationFilter, ExpenseWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "expenseId_userId">

  export type ExpenseParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    expenseId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: ExpenseParticipantCountOrderByAggregateInput
    _max?: ExpenseParticipantMaxOrderByAggregateInput
    _min?: ExpenseParticipantMinOrderByAggregateInput
  }

  export type ExpenseParticipantScalarWhereWithAggregatesInput = {
    AND?: ExpenseParticipantScalarWhereWithAggregatesInput | ExpenseParticipantScalarWhereWithAggregatesInput[]
    OR?: ExpenseParticipantScalarWhereWithAggregatesInput[]
    NOT?: ExpenseParticipantScalarWhereWithAggregatesInput | ExpenseParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExpenseParticipant"> | string
    expenseId?: StringWithAggregatesFilter<"ExpenseParticipant"> | string
    userId?: StringWithAggregatesFilter<"ExpenseParticipant"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ExpenseParticipant"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    relatedTransactionId?: StringNullableFilter<"Notification"> | string | null
    relatedFriendshipId?: StringNullableFilter<"Notification"> | string | null
    relatedGatheringId?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    relatedTransaction?: XOR<TransactionNullableScalarRelationFilter, TransactionWhereInput> | null
    relatedFriendship?: XOR<FriendshipNullableScalarRelationFilter, FriendshipWhereInput> | null
    relatedGathering?: XOR<GatheringNullableScalarRelationFilter, GatheringWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    relatedTransactionId?: SortOrderInput | SortOrder
    relatedFriendshipId?: SortOrderInput | SortOrder
    relatedGatheringId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    relatedTransaction?: TransactionOrderByWithRelationInput
    relatedFriendship?: FriendshipOrderByWithRelationInput
    relatedGathering?: GatheringOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    relatedTransactionId?: StringNullableFilter<"Notification"> | string | null
    relatedFriendshipId?: StringNullableFilter<"Notification"> | string | null
    relatedGatheringId?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    relatedTransaction?: XOR<TransactionNullableScalarRelationFilter, TransactionWhereInput> | null
    relatedFriendship?: XOR<FriendshipNullableScalarRelationFilter, FriendshipWhereInput> | null
    relatedGathering?: XOR<GatheringNullableScalarRelationFilter, GatheringWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    relatedTransactionId?: SortOrderInput | SortOrder
    relatedFriendshipId?: SortOrderInput | SortOrder
    relatedGatheringId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    type?: EnumNotificationTypeWithAggregatesFilter<"Notification"> | $Enums.NotificationType
    title?: StringWithAggregatesFilter<"Notification"> | string
    body?: StringWithAggregatesFilter<"Notification"> | string
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    relatedTransactionId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    relatedFriendshipId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    relatedGatheringId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipCreateInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    requester: UserCreateNestedOneWithoutFriendshipsSentInput
    addressee: UserCreateNestedOneWithoutFriendshipsReceivedInput
    notifications?: NotificationCreateNestedManyWithoutRelatedFriendshipInput
  }

  export type FriendshipUncheckedCreateInput = {
    id?: string
    requesterId: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedFriendshipInput
  }

  export type FriendshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requester?: UserUpdateOneRequiredWithoutFriendshipsSentNestedInput
    addressee?: UserUpdateOneRequiredWithoutFriendshipsReceivedNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedFriendshipNestedInput
  }

  export type FriendshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedFriendshipNestedInput
  }

  export type FriendshipCreateManyInput = {
    id?: string
    requesterId: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutTransactionsCreatedInput
    debtor: UserCreateNestedOneWithoutTransactionsDebtorInput
    creditor: UserCreateNestedOneWithoutTransactionsCreditorInput
    confirmationFrom: UserCreateNestedOneWithoutTransactionsToConfirmInput
    notifications?: NotificationCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    creatorId: string
    debtorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutTransactionsCreatedNestedInput
    debtor?: UserUpdateOneRequiredWithoutTransactionsDebtorNestedInput
    creditor?: UserUpdateOneRequiredWithoutTransactionsCreditorNestedInput
    confirmationFrom?: UserUpdateOneRequiredWithoutTransactionsToConfirmNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionCreateManyInput = {
    id?: string
    creatorId: string
    debtorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GatheringCreateInput = {
    id?: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutGatheringsInput
    expenses?: ExpenseCreateNestedManyWithoutGatheringInput
    notifications?: NotificationCreateNestedManyWithoutRelatedGatheringInput
  }

  export type GatheringUncheckedCreateInput = {
    id?: string
    creatorId: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    expenses?: ExpenseUncheckedCreateNestedManyWithoutGatheringInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedGatheringInput
  }

  export type GatheringUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutGatheringsNestedInput
    expenses?: ExpenseUpdateManyWithoutGatheringNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedGatheringNestedInput
  }

  export type GatheringUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expenses?: ExpenseUncheckedUpdateManyWithoutGatheringNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedGatheringNestedInput
  }

  export type GatheringCreateManyInput = {
    id?: string
    creatorId: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GatheringUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GatheringUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseCreateInput = {
    id?: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gathering: GatheringCreateNestedOneWithoutExpensesInput
    creator: UserCreateNestedOneWithoutExpensesCreatedInput
    participants?: ExpenseParticipantCreateNestedManyWithoutExpenseInput
  }

  export type ExpenseUncheckedCreateInput = {
    id?: string
    gatheringId: string
    createdById: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ExpenseParticipantUncheckedCreateNestedManyWithoutExpenseInput
  }

  export type ExpenseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gathering?: GatheringUpdateOneRequiredWithoutExpensesNestedInput
    creator?: UserUpdateOneRequiredWithoutExpensesCreatedNestedInput
    participants?: ExpenseParticipantUpdateManyWithoutExpenseNestedInput
  }

  export type ExpenseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gatheringId?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ExpenseParticipantUncheckedUpdateManyWithoutExpenseNestedInput
  }

  export type ExpenseCreateManyInput = {
    id?: string
    gatheringId: string
    createdById: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExpenseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gatheringId?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseParticipantCreateInput = {
    id?: string
    createdAt?: Date | string
    expense: ExpenseCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutExpenseParticipationsInput
  }

  export type ExpenseParticipantUncheckedCreateInput = {
    id?: string
    expenseId: string
    userId: string
    createdAt?: Date | string
  }

  export type ExpenseParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expense?: ExpenseUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutExpenseParticipationsNestedInput
  }

  export type ExpenseParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseParticipantCreateManyInput = {
    id?: string
    expenseId: string
    userId: string
    createdAt?: Date | string
  }

  export type ExpenseParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    relatedTransaction?: TransactionCreateNestedOneWithoutNotificationsInput
    relatedFriendship?: FriendshipCreateNestedOneWithoutNotificationsInput
    relatedGathering?: GatheringCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedTransactionId?: string | null
    relatedFriendshipId?: string | null
    relatedGatheringId?: string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    relatedTransaction?: TransactionUpdateOneWithoutNotificationsNestedInput
    relatedFriendship?: FriendshipUpdateOneWithoutNotificationsNestedInput
    relatedGathering?: GatheringUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedFriendshipId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedGatheringId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedTransactionId?: string | null
    relatedFriendshipId?: string | null
    relatedGatheringId?: string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedFriendshipId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedGatheringId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FriendshipListRelationFilter = {
    every?: FriendshipWhereInput
    some?: FriendshipWhereInput
    none?: FriendshipWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type GatheringListRelationFilter = {
    every?: GatheringWhereInput
    some?: GatheringWhereInput
    none?: GatheringWhereInput
  }

  export type ExpenseListRelationFilter = {
    every?: ExpenseWhereInput
    some?: ExpenseWhereInput
    none?: ExpenseWhereInput
  }

  export type ExpenseParticipantListRelationFilter = {
    every?: ExpenseParticipantWhereInput
    some?: ExpenseParticipantWhereInput
    none?: ExpenseParticipantWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FriendshipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GatheringOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExpenseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExpenseParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumFriendshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusFilter<$PrismaModel> | $Enums.FriendshipStatus
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FriendshipRequesterIdAddresseeIdCompoundUniqueInput = {
    requesterId: string
    addresseeId: string
  }

  export type FriendshipCountOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipMaxOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipMinOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumFriendshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendshipStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendshipStatusFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type EnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    creatorId?: SortOrder
    debtorId?: SortOrder
    creditorId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    pendingConfirmationFromId?: SortOrder
    occurredAt?: SortOrder
    confirmedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    creatorId?: SortOrder
    debtorId?: SortOrder
    creditorId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    pendingConfirmationFromId?: SortOrder
    occurredAt?: SortOrder
    confirmedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    creatorId?: SortOrder
    debtorId?: SortOrder
    creditorId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    pendingConfirmationFromId?: SortOrder
    occurredAt?: SortOrder
    confirmedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type EnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type GatheringCountOrderByAggregateInput = {
    id?: SortOrder
    creatorId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GatheringMaxOrderByAggregateInput = {
    id?: SortOrder
    creatorId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GatheringMinOrderByAggregateInput = {
    id?: SortOrder
    creatorId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GatheringScalarRelationFilter = {
    is?: GatheringWhereInput
    isNot?: GatheringWhereInput
  }

  export type ExpenseCountOrderByAggregateInput = {
    id?: SortOrder
    gatheringId?: SortOrder
    createdById?: SortOrder
    title?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExpenseAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ExpenseMaxOrderByAggregateInput = {
    id?: SortOrder
    gatheringId?: SortOrder
    createdById?: SortOrder
    title?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExpenseMinOrderByAggregateInput = {
    id?: SortOrder
    gatheringId?: SortOrder
    createdById?: SortOrder
    title?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExpenseSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ExpenseScalarRelationFilter = {
    is?: ExpenseWhereInput
    isNot?: ExpenseWhereInput
  }

  export type ExpenseParticipantExpenseIdUserIdCompoundUniqueInput = {
    expenseId: string
    userId: string
  }

  export type ExpenseParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    expenseId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type ExpenseParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    expenseId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type ExpenseParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    expenseId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TransactionNullableScalarRelationFilter = {
    is?: TransactionWhereInput | null
    isNot?: TransactionWhereInput | null
  }

  export type FriendshipNullableScalarRelationFilter = {
    is?: FriendshipWhereInput | null
    isNot?: FriendshipWhereInput | null
  }

  export type GatheringNullableScalarRelationFilter = {
    is?: GatheringWhereInput | null
    isNot?: GatheringWhereInput | null
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    relatedTransactionId?: SortOrder
    relatedFriendshipId?: SortOrder
    relatedGatheringId?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    relatedTransactionId?: SortOrder
    relatedFriendshipId?: SortOrder
    relatedGatheringId?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    relatedTransactionId?: SortOrder
    relatedFriendshipId?: SortOrder
    relatedGatheringId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FriendshipCreateNestedManyWithoutRequesterInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type FriendshipCreateNestedManyWithoutAddresseeInput = {
    create?: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput> | FriendshipCreateWithoutAddresseeInput[] | FriendshipUncheckedCreateWithoutAddresseeInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutAddresseeInput | FriendshipCreateOrConnectWithoutAddresseeInput[]
    createMany?: FriendshipCreateManyAddresseeInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutCreatorInput = {
    create?: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput> | TransactionCreateWithoutCreatorInput[] | TransactionUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreatorInput | TransactionCreateOrConnectWithoutCreatorInput[]
    createMany?: TransactionCreateManyCreatorInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutDebtorInput = {
    create?: XOR<TransactionCreateWithoutDebtorInput, TransactionUncheckedCreateWithoutDebtorInput> | TransactionCreateWithoutDebtorInput[] | TransactionUncheckedCreateWithoutDebtorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutDebtorInput | TransactionCreateOrConnectWithoutDebtorInput[]
    createMany?: TransactionCreateManyDebtorInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutCreditorInput = {
    create?: XOR<TransactionCreateWithoutCreditorInput, TransactionUncheckedCreateWithoutCreditorInput> | TransactionCreateWithoutCreditorInput[] | TransactionUncheckedCreateWithoutCreditorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreditorInput | TransactionCreateOrConnectWithoutCreditorInput[]
    createMany?: TransactionCreateManyCreditorInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutConfirmationFromInput = {
    create?: XOR<TransactionCreateWithoutConfirmationFromInput, TransactionUncheckedCreateWithoutConfirmationFromInput> | TransactionCreateWithoutConfirmationFromInput[] | TransactionUncheckedCreateWithoutConfirmationFromInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutConfirmationFromInput | TransactionCreateOrConnectWithoutConfirmationFromInput[]
    createMany?: TransactionCreateManyConfirmationFromInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type GatheringCreateNestedManyWithoutCreatorInput = {
    create?: XOR<GatheringCreateWithoutCreatorInput, GatheringUncheckedCreateWithoutCreatorInput> | GatheringCreateWithoutCreatorInput[] | GatheringUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GatheringCreateOrConnectWithoutCreatorInput | GatheringCreateOrConnectWithoutCreatorInput[]
    createMany?: GatheringCreateManyCreatorInputEnvelope
    connect?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
  }

  export type ExpenseCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ExpenseCreateWithoutCreatorInput, ExpenseUncheckedCreateWithoutCreatorInput> | ExpenseCreateWithoutCreatorInput[] | ExpenseUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ExpenseCreateOrConnectWithoutCreatorInput | ExpenseCreateOrConnectWithoutCreatorInput[]
    createMany?: ExpenseCreateManyCreatorInputEnvelope
    connect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
  }

  export type ExpenseParticipantCreateNestedManyWithoutUserInput = {
    create?: XOR<ExpenseParticipantCreateWithoutUserInput, ExpenseParticipantUncheckedCreateWithoutUserInput> | ExpenseParticipantCreateWithoutUserInput[] | ExpenseParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExpenseParticipantCreateOrConnectWithoutUserInput | ExpenseParticipantCreateOrConnectWithoutUserInput[]
    createMany?: ExpenseParticipantCreateManyUserInputEnvelope
    connect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type FriendshipUncheckedCreateNestedManyWithoutRequesterInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type FriendshipUncheckedCreateNestedManyWithoutAddresseeInput = {
    create?: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput> | FriendshipCreateWithoutAddresseeInput[] | FriendshipUncheckedCreateWithoutAddresseeInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutAddresseeInput | FriendshipCreateOrConnectWithoutAddresseeInput[]
    createMany?: FriendshipCreateManyAddresseeInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput> | TransactionCreateWithoutCreatorInput[] | TransactionUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreatorInput | TransactionCreateOrConnectWithoutCreatorInput[]
    createMany?: TransactionCreateManyCreatorInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutDebtorInput = {
    create?: XOR<TransactionCreateWithoutDebtorInput, TransactionUncheckedCreateWithoutDebtorInput> | TransactionCreateWithoutDebtorInput[] | TransactionUncheckedCreateWithoutDebtorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutDebtorInput | TransactionCreateOrConnectWithoutDebtorInput[]
    createMany?: TransactionCreateManyDebtorInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutCreditorInput = {
    create?: XOR<TransactionCreateWithoutCreditorInput, TransactionUncheckedCreateWithoutCreditorInput> | TransactionCreateWithoutCreditorInput[] | TransactionUncheckedCreateWithoutCreditorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreditorInput | TransactionCreateOrConnectWithoutCreditorInput[]
    createMany?: TransactionCreateManyCreditorInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput = {
    create?: XOR<TransactionCreateWithoutConfirmationFromInput, TransactionUncheckedCreateWithoutConfirmationFromInput> | TransactionCreateWithoutConfirmationFromInput[] | TransactionUncheckedCreateWithoutConfirmationFromInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutConfirmationFromInput | TransactionCreateOrConnectWithoutConfirmationFromInput[]
    createMany?: TransactionCreateManyConfirmationFromInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type GatheringUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<GatheringCreateWithoutCreatorInput, GatheringUncheckedCreateWithoutCreatorInput> | GatheringCreateWithoutCreatorInput[] | GatheringUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GatheringCreateOrConnectWithoutCreatorInput | GatheringCreateOrConnectWithoutCreatorInput[]
    createMany?: GatheringCreateManyCreatorInputEnvelope
    connect?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
  }

  export type ExpenseUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ExpenseCreateWithoutCreatorInput, ExpenseUncheckedCreateWithoutCreatorInput> | ExpenseCreateWithoutCreatorInput[] | ExpenseUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ExpenseCreateOrConnectWithoutCreatorInput | ExpenseCreateOrConnectWithoutCreatorInput[]
    createMany?: ExpenseCreateManyCreatorInputEnvelope
    connect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
  }

  export type ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExpenseParticipantCreateWithoutUserInput, ExpenseParticipantUncheckedCreateWithoutUserInput> | ExpenseParticipantCreateWithoutUserInput[] | ExpenseParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExpenseParticipantCreateOrConnectWithoutUserInput | ExpenseParticipantCreateOrConnectWithoutUserInput[]
    createMany?: ExpenseParticipantCreateManyUserInputEnvelope
    connect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FriendshipUpdateManyWithoutRequesterNestedInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutRequesterInput | FriendshipUpsertWithWhereUniqueWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutRequesterInput | FriendshipUpdateWithWhereUniqueWithoutRequesterInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutRequesterInput | FriendshipUpdateManyWithWhereWithoutRequesterInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type FriendshipUpdateManyWithoutAddresseeNestedInput = {
    create?: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput> | FriendshipCreateWithoutAddresseeInput[] | FriendshipUncheckedCreateWithoutAddresseeInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutAddresseeInput | FriendshipCreateOrConnectWithoutAddresseeInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutAddresseeInput | FriendshipUpsertWithWhereUniqueWithoutAddresseeInput[]
    createMany?: FriendshipCreateManyAddresseeInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutAddresseeInput | FriendshipUpdateWithWhereUniqueWithoutAddresseeInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutAddresseeInput | FriendshipUpdateManyWithWhereWithoutAddresseeInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput> | TransactionCreateWithoutCreatorInput[] | TransactionUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreatorInput | TransactionCreateOrConnectWithoutCreatorInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCreatorInput | TransactionUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: TransactionCreateManyCreatorInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCreatorInput | TransactionUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCreatorInput | TransactionUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutDebtorNestedInput = {
    create?: XOR<TransactionCreateWithoutDebtorInput, TransactionUncheckedCreateWithoutDebtorInput> | TransactionCreateWithoutDebtorInput[] | TransactionUncheckedCreateWithoutDebtorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutDebtorInput | TransactionCreateOrConnectWithoutDebtorInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutDebtorInput | TransactionUpsertWithWhereUniqueWithoutDebtorInput[]
    createMany?: TransactionCreateManyDebtorInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutDebtorInput | TransactionUpdateWithWhereUniqueWithoutDebtorInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutDebtorInput | TransactionUpdateManyWithWhereWithoutDebtorInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutCreditorNestedInput = {
    create?: XOR<TransactionCreateWithoutCreditorInput, TransactionUncheckedCreateWithoutCreditorInput> | TransactionCreateWithoutCreditorInput[] | TransactionUncheckedCreateWithoutCreditorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreditorInput | TransactionCreateOrConnectWithoutCreditorInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCreditorInput | TransactionUpsertWithWhereUniqueWithoutCreditorInput[]
    createMany?: TransactionCreateManyCreditorInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCreditorInput | TransactionUpdateWithWhereUniqueWithoutCreditorInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCreditorInput | TransactionUpdateManyWithWhereWithoutCreditorInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutConfirmationFromNestedInput = {
    create?: XOR<TransactionCreateWithoutConfirmationFromInput, TransactionUncheckedCreateWithoutConfirmationFromInput> | TransactionCreateWithoutConfirmationFromInput[] | TransactionUncheckedCreateWithoutConfirmationFromInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutConfirmationFromInput | TransactionCreateOrConnectWithoutConfirmationFromInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutConfirmationFromInput | TransactionUpsertWithWhereUniqueWithoutConfirmationFromInput[]
    createMany?: TransactionCreateManyConfirmationFromInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutConfirmationFromInput | TransactionUpdateWithWhereUniqueWithoutConfirmationFromInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutConfirmationFromInput | TransactionUpdateManyWithWhereWithoutConfirmationFromInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type GatheringUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<GatheringCreateWithoutCreatorInput, GatheringUncheckedCreateWithoutCreatorInput> | GatheringCreateWithoutCreatorInput[] | GatheringUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GatheringCreateOrConnectWithoutCreatorInput | GatheringCreateOrConnectWithoutCreatorInput[]
    upsert?: GatheringUpsertWithWhereUniqueWithoutCreatorInput | GatheringUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: GatheringCreateManyCreatorInputEnvelope
    set?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
    disconnect?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
    delete?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
    connect?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
    update?: GatheringUpdateWithWhereUniqueWithoutCreatorInput | GatheringUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: GatheringUpdateManyWithWhereWithoutCreatorInput | GatheringUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: GatheringScalarWhereInput | GatheringScalarWhereInput[]
  }

  export type ExpenseUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ExpenseCreateWithoutCreatorInput, ExpenseUncheckedCreateWithoutCreatorInput> | ExpenseCreateWithoutCreatorInput[] | ExpenseUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ExpenseCreateOrConnectWithoutCreatorInput | ExpenseCreateOrConnectWithoutCreatorInput[]
    upsert?: ExpenseUpsertWithWhereUniqueWithoutCreatorInput | ExpenseUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ExpenseCreateManyCreatorInputEnvelope
    set?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    disconnect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    delete?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    connect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    update?: ExpenseUpdateWithWhereUniqueWithoutCreatorInput | ExpenseUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ExpenseUpdateManyWithWhereWithoutCreatorInput | ExpenseUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ExpenseScalarWhereInput | ExpenseScalarWhereInput[]
  }

  export type ExpenseParticipantUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExpenseParticipantCreateWithoutUserInput, ExpenseParticipantUncheckedCreateWithoutUserInput> | ExpenseParticipantCreateWithoutUserInput[] | ExpenseParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExpenseParticipantCreateOrConnectWithoutUserInput | ExpenseParticipantCreateOrConnectWithoutUserInput[]
    upsert?: ExpenseParticipantUpsertWithWhereUniqueWithoutUserInput | ExpenseParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExpenseParticipantCreateManyUserInputEnvelope
    set?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    disconnect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    delete?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    connect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    update?: ExpenseParticipantUpdateWithWhereUniqueWithoutUserInput | ExpenseParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExpenseParticipantUpdateManyWithWhereWithoutUserInput | ExpenseParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExpenseParticipantScalarWhereInput | ExpenseParticipantScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type FriendshipUncheckedUpdateManyWithoutRequesterNestedInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutRequesterInput | FriendshipUpsertWithWhereUniqueWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutRequesterInput | FriendshipUpdateWithWhereUniqueWithoutRequesterInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutRequesterInput | FriendshipUpdateManyWithWhereWithoutRequesterInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput = {
    create?: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput> | FriendshipCreateWithoutAddresseeInput[] | FriendshipUncheckedCreateWithoutAddresseeInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutAddresseeInput | FriendshipCreateOrConnectWithoutAddresseeInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutAddresseeInput | FriendshipUpsertWithWhereUniqueWithoutAddresseeInput[]
    createMany?: FriendshipCreateManyAddresseeInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutAddresseeInput | FriendshipUpdateWithWhereUniqueWithoutAddresseeInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutAddresseeInput | FriendshipUpdateManyWithWhereWithoutAddresseeInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput> | TransactionCreateWithoutCreatorInput[] | TransactionUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreatorInput | TransactionCreateOrConnectWithoutCreatorInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCreatorInput | TransactionUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: TransactionCreateManyCreatorInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCreatorInput | TransactionUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCreatorInput | TransactionUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutDebtorNestedInput = {
    create?: XOR<TransactionCreateWithoutDebtorInput, TransactionUncheckedCreateWithoutDebtorInput> | TransactionCreateWithoutDebtorInput[] | TransactionUncheckedCreateWithoutDebtorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutDebtorInput | TransactionCreateOrConnectWithoutDebtorInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutDebtorInput | TransactionUpsertWithWhereUniqueWithoutDebtorInput[]
    createMany?: TransactionCreateManyDebtorInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutDebtorInput | TransactionUpdateWithWhereUniqueWithoutDebtorInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutDebtorInput | TransactionUpdateManyWithWhereWithoutDebtorInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutCreditorNestedInput = {
    create?: XOR<TransactionCreateWithoutCreditorInput, TransactionUncheckedCreateWithoutCreditorInput> | TransactionCreateWithoutCreditorInput[] | TransactionUncheckedCreateWithoutCreditorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreditorInput | TransactionCreateOrConnectWithoutCreditorInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCreditorInput | TransactionUpsertWithWhereUniqueWithoutCreditorInput[]
    createMany?: TransactionCreateManyCreditorInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCreditorInput | TransactionUpdateWithWhereUniqueWithoutCreditorInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCreditorInput | TransactionUpdateManyWithWhereWithoutCreditorInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput = {
    create?: XOR<TransactionCreateWithoutConfirmationFromInput, TransactionUncheckedCreateWithoutConfirmationFromInput> | TransactionCreateWithoutConfirmationFromInput[] | TransactionUncheckedCreateWithoutConfirmationFromInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutConfirmationFromInput | TransactionCreateOrConnectWithoutConfirmationFromInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutConfirmationFromInput | TransactionUpsertWithWhereUniqueWithoutConfirmationFromInput[]
    createMany?: TransactionCreateManyConfirmationFromInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutConfirmationFromInput | TransactionUpdateWithWhereUniqueWithoutConfirmationFromInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutConfirmationFromInput | TransactionUpdateManyWithWhereWithoutConfirmationFromInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type GatheringUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<GatheringCreateWithoutCreatorInput, GatheringUncheckedCreateWithoutCreatorInput> | GatheringCreateWithoutCreatorInput[] | GatheringUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GatheringCreateOrConnectWithoutCreatorInput | GatheringCreateOrConnectWithoutCreatorInput[]
    upsert?: GatheringUpsertWithWhereUniqueWithoutCreatorInput | GatheringUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: GatheringCreateManyCreatorInputEnvelope
    set?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
    disconnect?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
    delete?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
    connect?: GatheringWhereUniqueInput | GatheringWhereUniqueInput[]
    update?: GatheringUpdateWithWhereUniqueWithoutCreatorInput | GatheringUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: GatheringUpdateManyWithWhereWithoutCreatorInput | GatheringUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: GatheringScalarWhereInput | GatheringScalarWhereInput[]
  }

  export type ExpenseUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ExpenseCreateWithoutCreatorInput, ExpenseUncheckedCreateWithoutCreatorInput> | ExpenseCreateWithoutCreatorInput[] | ExpenseUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ExpenseCreateOrConnectWithoutCreatorInput | ExpenseCreateOrConnectWithoutCreatorInput[]
    upsert?: ExpenseUpsertWithWhereUniqueWithoutCreatorInput | ExpenseUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ExpenseCreateManyCreatorInputEnvelope
    set?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    disconnect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    delete?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    connect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    update?: ExpenseUpdateWithWhereUniqueWithoutCreatorInput | ExpenseUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ExpenseUpdateManyWithWhereWithoutCreatorInput | ExpenseUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ExpenseScalarWhereInput | ExpenseScalarWhereInput[]
  }

  export type ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExpenseParticipantCreateWithoutUserInput, ExpenseParticipantUncheckedCreateWithoutUserInput> | ExpenseParticipantCreateWithoutUserInput[] | ExpenseParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExpenseParticipantCreateOrConnectWithoutUserInput | ExpenseParticipantCreateOrConnectWithoutUserInput[]
    upsert?: ExpenseParticipantUpsertWithWhereUniqueWithoutUserInput | ExpenseParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExpenseParticipantCreateManyUserInputEnvelope
    set?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    disconnect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    delete?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    connect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    update?: ExpenseParticipantUpdateWithWhereUniqueWithoutUserInput | ExpenseParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExpenseParticipantUpdateManyWithWhereWithoutUserInput | ExpenseParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExpenseParticipantScalarWhereInput | ExpenseParticipantScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutFriendshipsSentInput = {
    create?: XOR<UserCreateWithoutFriendshipsSentInput, UserUncheckedCreateWithoutFriendshipsSentInput>
    connectOrCreate?: UserCreateOrConnectWithoutFriendshipsSentInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFriendshipsReceivedInput = {
    create?: XOR<UserCreateWithoutFriendshipsReceivedInput, UserUncheckedCreateWithoutFriendshipsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFriendshipsReceivedInput
    connect?: UserWhereUniqueInput
  }

  export type NotificationCreateNestedManyWithoutRelatedFriendshipInput = {
    create?: XOR<NotificationCreateWithoutRelatedFriendshipInput, NotificationUncheckedCreateWithoutRelatedFriendshipInput> | NotificationCreateWithoutRelatedFriendshipInput[] | NotificationUncheckedCreateWithoutRelatedFriendshipInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedFriendshipInput | NotificationCreateOrConnectWithoutRelatedFriendshipInput[]
    createMany?: NotificationCreateManyRelatedFriendshipInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutRelatedFriendshipInput = {
    create?: XOR<NotificationCreateWithoutRelatedFriendshipInput, NotificationUncheckedCreateWithoutRelatedFriendshipInput> | NotificationCreateWithoutRelatedFriendshipInput[] | NotificationUncheckedCreateWithoutRelatedFriendshipInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedFriendshipInput | NotificationCreateOrConnectWithoutRelatedFriendshipInput[]
    createMany?: NotificationCreateManyRelatedFriendshipInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type EnumFriendshipStatusFieldUpdateOperationsInput = {
    set?: $Enums.FriendshipStatus
  }

  export type UserUpdateOneRequiredWithoutFriendshipsSentNestedInput = {
    create?: XOR<UserCreateWithoutFriendshipsSentInput, UserUncheckedCreateWithoutFriendshipsSentInput>
    connectOrCreate?: UserCreateOrConnectWithoutFriendshipsSentInput
    upsert?: UserUpsertWithoutFriendshipsSentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFriendshipsSentInput, UserUpdateWithoutFriendshipsSentInput>, UserUncheckedUpdateWithoutFriendshipsSentInput>
  }

  export type UserUpdateOneRequiredWithoutFriendshipsReceivedNestedInput = {
    create?: XOR<UserCreateWithoutFriendshipsReceivedInput, UserUncheckedCreateWithoutFriendshipsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFriendshipsReceivedInput
    upsert?: UserUpsertWithoutFriendshipsReceivedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFriendshipsReceivedInput, UserUpdateWithoutFriendshipsReceivedInput>, UserUncheckedUpdateWithoutFriendshipsReceivedInput>
  }

  export type NotificationUpdateManyWithoutRelatedFriendshipNestedInput = {
    create?: XOR<NotificationCreateWithoutRelatedFriendshipInput, NotificationUncheckedCreateWithoutRelatedFriendshipInput> | NotificationCreateWithoutRelatedFriendshipInput[] | NotificationUncheckedCreateWithoutRelatedFriendshipInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedFriendshipInput | NotificationCreateOrConnectWithoutRelatedFriendshipInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutRelatedFriendshipInput | NotificationUpsertWithWhereUniqueWithoutRelatedFriendshipInput[]
    createMany?: NotificationCreateManyRelatedFriendshipInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutRelatedFriendshipInput | NotificationUpdateWithWhereUniqueWithoutRelatedFriendshipInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutRelatedFriendshipInput | NotificationUpdateManyWithWhereWithoutRelatedFriendshipInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutRelatedFriendshipNestedInput = {
    create?: XOR<NotificationCreateWithoutRelatedFriendshipInput, NotificationUncheckedCreateWithoutRelatedFriendshipInput> | NotificationCreateWithoutRelatedFriendshipInput[] | NotificationUncheckedCreateWithoutRelatedFriendshipInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedFriendshipInput | NotificationCreateOrConnectWithoutRelatedFriendshipInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutRelatedFriendshipInput | NotificationUpsertWithWhereUniqueWithoutRelatedFriendshipInput[]
    createMany?: NotificationCreateManyRelatedFriendshipInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutRelatedFriendshipInput | NotificationUpdateWithWhereUniqueWithoutRelatedFriendshipInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutRelatedFriendshipInput | NotificationUpdateManyWithWhereWithoutRelatedFriendshipInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTransactionsCreatedInput = {
    create?: XOR<UserCreateWithoutTransactionsCreatedInput, UserUncheckedCreateWithoutTransactionsCreatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsCreatedInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTransactionsDebtorInput = {
    create?: XOR<UserCreateWithoutTransactionsDebtorInput, UserUncheckedCreateWithoutTransactionsDebtorInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsDebtorInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTransactionsCreditorInput = {
    create?: XOR<UserCreateWithoutTransactionsCreditorInput, UserUncheckedCreateWithoutTransactionsCreditorInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsCreditorInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTransactionsToConfirmInput = {
    create?: XOR<UserCreateWithoutTransactionsToConfirmInput, UserUncheckedCreateWithoutTransactionsToConfirmInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsToConfirmInput
    connect?: UserWhereUniqueInput
  }

  export type NotificationCreateNestedManyWithoutRelatedTransactionInput = {
    create?: XOR<NotificationCreateWithoutRelatedTransactionInput, NotificationUncheckedCreateWithoutRelatedTransactionInput> | NotificationCreateWithoutRelatedTransactionInput[] | NotificationUncheckedCreateWithoutRelatedTransactionInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedTransactionInput | NotificationCreateOrConnectWithoutRelatedTransactionInput[]
    createMany?: NotificationCreateManyRelatedTransactionInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutRelatedTransactionInput = {
    create?: XOR<NotificationCreateWithoutRelatedTransactionInput, NotificationUncheckedCreateWithoutRelatedTransactionInput> | NotificationCreateWithoutRelatedTransactionInput[] | NotificationUncheckedCreateWithoutRelatedTransactionInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedTransactionInput | NotificationCreateOrConnectWithoutRelatedTransactionInput[]
    createMany?: NotificationCreateManyRelatedTransactionInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumTransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TransactionType
  }

  export type EnumTransactionStatusFieldUpdateOperationsInput = {
    set?: $Enums.TransactionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutTransactionsCreatedNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsCreatedInput, UserUncheckedCreateWithoutTransactionsCreatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsCreatedInput
    upsert?: UserUpsertWithoutTransactionsCreatedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsCreatedInput, UserUpdateWithoutTransactionsCreatedInput>, UserUncheckedUpdateWithoutTransactionsCreatedInput>
  }

  export type UserUpdateOneRequiredWithoutTransactionsDebtorNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsDebtorInput, UserUncheckedCreateWithoutTransactionsDebtorInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsDebtorInput
    upsert?: UserUpsertWithoutTransactionsDebtorInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsDebtorInput, UserUpdateWithoutTransactionsDebtorInput>, UserUncheckedUpdateWithoutTransactionsDebtorInput>
  }

  export type UserUpdateOneRequiredWithoutTransactionsCreditorNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsCreditorInput, UserUncheckedCreateWithoutTransactionsCreditorInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsCreditorInput
    upsert?: UserUpsertWithoutTransactionsCreditorInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsCreditorInput, UserUpdateWithoutTransactionsCreditorInput>, UserUncheckedUpdateWithoutTransactionsCreditorInput>
  }

  export type UserUpdateOneRequiredWithoutTransactionsToConfirmNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsToConfirmInput, UserUncheckedCreateWithoutTransactionsToConfirmInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsToConfirmInput
    upsert?: UserUpsertWithoutTransactionsToConfirmInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsToConfirmInput, UserUpdateWithoutTransactionsToConfirmInput>, UserUncheckedUpdateWithoutTransactionsToConfirmInput>
  }

  export type NotificationUpdateManyWithoutRelatedTransactionNestedInput = {
    create?: XOR<NotificationCreateWithoutRelatedTransactionInput, NotificationUncheckedCreateWithoutRelatedTransactionInput> | NotificationCreateWithoutRelatedTransactionInput[] | NotificationUncheckedCreateWithoutRelatedTransactionInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedTransactionInput | NotificationCreateOrConnectWithoutRelatedTransactionInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutRelatedTransactionInput | NotificationUpsertWithWhereUniqueWithoutRelatedTransactionInput[]
    createMany?: NotificationCreateManyRelatedTransactionInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutRelatedTransactionInput | NotificationUpdateWithWhereUniqueWithoutRelatedTransactionInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutRelatedTransactionInput | NotificationUpdateManyWithWhereWithoutRelatedTransactionInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutRelatedTransactionNestedInput = {
    create?: XOR<NotificationCreateWithoutRelatedTransactionInput, NotificationUncheckedCreateWithoutRelatedTransactionInput> | NotificationCreateWithoutRelatedTransactionInput[] | NotificationUncheckedCreateWithoutRelatedTransactionInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedTransactionInput | NotificationCreateOrConnectWithoutRelatedTransactionInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutRelatedTransactionInput | NotificationUpsertWithWhereUniqueWithoutRelatedTransactionInput[]
    createMany?: NotificationCreateManyRelatedTransactionInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutRelatedTransactionInput | NotificationUpdateWithWhereUniqueWithoutRelatedTransactionInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutRelatedTransactionInput | NotificationUpdateManyWithWhereWithoutRelatedTransactionInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutGatheringsInput = {
    create?: XOR<UserCreateWithoutGatheringsInput, UserUncheckedCreateWithoutGatheringsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGatheringsInput
    connect?: UserWhereUniqueInput
  }

  export type ExpenseCreateNestedManyWithoutGatheringInput = {
    create?: XOR<ExpenseCreateWithoutGatheringInput, ExpenseUncheckedCreateWithoutGatheringInput> | ExpenseCreateWithoutGatheringInput[] | ExpenseUncheckedCreateWithoutGatheringInput[]
    connectOrCreate?: ExpenseCreateOrConnectWithoutGatheringInput | ExpenseCreateOrConnectWithoutGatheringInput[]
    createMany?: ExpenseCreateManyGatheringInputEnvelope
    connect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutRelatedGatheringInput = {
    create?: XOR<NotificationCreateWithoutRelatedGatheringInput, NotificationUncheckedCreateWithoutRelatedGatheringInput> | NotificationCreateWithoutRelatedGatheringInput[] | NotificationUncheckedCreateWithoutRelatedGatheringInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedGatheringInput | NotificationCreateOrConnectWithoutRelatedGatheringInput[]
    createMany?: NotificationCreateManyRelatedGatheringInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type ExpenseUncheckedCreateNestedManyWithoutGatheringInput = {
    create?: XOR<ExpenseCreateWithoutGatheringInput, ExpenseUncheckedCreateWithoutGatheringInput> | ExpenseCreateWithoutGatheringInput[] | ExpenseUncheckedCreateWithoutGatheringInput[]
    connectOrCreate?: ExpenseCreateOrConnectWithoutGatheringInput | ExpenseCreateOrConnectWithoutGatheringInput[]
    createMany?: ExpenseCreateManyGatheringInputEnvelope
    connect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutRelatedGatheringInput = {
    create?: XOR<NotificationCreateWithoutRelatedGatheringInput, NotificationUncheckedCreateWithoutRelatedGatheringInput> | NotificationCreateWithoutRelatedGatheringInput[] | NotificationUncheckedCreateWithoutRelatedGatheringInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedGatheringInput | NotificationCreateOrConnectWithoutRelatedGatheringInput[]
    createMany?: NotificationCreateManyRelatedGatheringInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutGatheringsNestedInput = {
    create?: XOR<UserCreateWithoutGatheringsInput, UserUncheckedCreateWithoutGatheringsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGatheringsInput
    upsert?: UserUpsertWithoutGatheringsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGatheringsInput, UserUpdateWithoutGatheringsInput>, UserUncheckedUpdateWithoutGatheringsInput>
  }

  export type ExpenseUpdateManyWithoutGatheringNestedInput = {
    create?: XOR<ExpenseCreateWithoutGatheringInput, ExpenseUncheckedCreateWithoutGatheringInput> | ExpenseCreateWithoutGatheringInput[] | ExpenseUncheckedCreateWithoutGatheringInput[]
    connectOrCreate?: ExpenseCreateOrConnectWithoutGatheringInput | ExpenseCreateOrConnectWithoutGatheringInput[]
    upsert?: ExpenseUpsertWithWhereUniqueWithoutGatheringInput | ExpenseUpsertWithWhereUniqueWithoutGatheringInput[]
    createMany?: ExpenseCreateManyGatheringInputEnvelope
    set?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    disconnect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    delete?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    connect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    update?: ExpenseUpdateWithWhereUniqueWithoutGatheringInput | ExpenseUpdateWithWhereUniqueWithoutGatheringInput[]
    updateMany?: ExpenseUpdateManyWithWhereWithoutGatheringInput | ExpenseUpdateManyWithWhereWithoutGatheringInput[]
    deleteMany?: ExpenseScalarWhereInput | ExpenseScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutRelatedGatheringNestedInput = {
    create?: XOR<NotificationCreateWithoutRelatedGatheringInput, NotificationUncheckedCreateWithoutRelatedGatheringInput> | NotificationCreateWithoutRelatedGatheringInput[] | NotificationUncheckedCreateWithoutRelatedGatheringInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedGatheringInput | NotificationCreateOrConnectWithoutRelatedGatheringInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutRelatedGatheringInput | NotificationUpsertWithWhereUniqueWithoutRelatedGatheringInput[]
    createMany?: NotificationCreateManyRelatedGatheringInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutRelatedGatheringInput | NotificationUpdateWithWhereUniqueWithoutRelatedGatheringInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutRelatedGatheringInput | NotificationUpdateManyWithWhereWithoutRelatedGatheringInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type ExpenseUncheckedUpdateManyWithoutGatheringNestedInput = {
    create?: XOR<ExpenseCreateWithoutGatheringInput, ExpenseUncheckedCreateWithoutGatheringInput> | ExpenseCreateWithoutGatheringInput[] | ExpenseUncheckedCreateWithoutGatheringInput[]
    connectOrCreate?: ExpenseCreateOrConnectWithoutGatheringInput | ExpenseCreateOrConnectWithoutGatheringInput[]
    upsert?: ExpenseUpsertWithWhereUniqueWithoutGatheringInput | ExpenseUpsertWithWhereUniqueWithoutGatheringInput[]
    createMany?: ExpenseCreateManyGatheringInputEnvelope
    set?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    disconnect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    delete?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    connect?: ExpenseWhereUniqueInput | ExpenseWhereUniqueInput[]
    update?: ExpenseUpdateWithWhereUniqueWithoutGatheringInput | ExpenseUpdateWithWhereUniqueWithoutGatheringInput[]
    updateMany?: ExpenseUpdateManyWithWhereWithoutGatheringInput | ExpenseUpdateManyWithWhereWithoutGatheringInput[]
    deleteMany?: ExpenseScalarWhereInput | ExpenseScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutRelatedGatheringNestedInput = {
    create?: XOR<NotificationCreateWithoutRelatedGatheringInput, NotificationUncheckedCreateWithoutRelatedGatheringInput> | NotificationCreateWithoutRelatedGatheringInput[] | NotificationUncheckedCreateWithoutRelatedGatheringInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRelatedGatheringInput | NotificationCreateOrConnectWithoutRelatedGatheringInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutRelatedGatheringInput | NotificationUpsertWithWhereUniqueWithoutRelatedGatheringInput[]
    createMany?: NotificationCreateManyRelatedGatheringInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutRelatedGatheringInput | NotificationUpdateWithWhereUniqueWithoutRelatedGatheringInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutRelatedGatheringInput | NotificationUpdateManyWithWhereWithoutRelatedGatheringInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type GatheringCreateNestedOneWithoutExpensesInput = {
    create?: XOR<GatheringCreateWithoutExpensesInput, GatheringUncheckedCreateWithoutExpensesInput>
    connectOrCreate?: GatheringCreateOrConnectWithoutExpensesInput
    connect?: GatheringWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutExpensesCreatedInput = {
    create?: XOR<UserCreateWithoutExpensesCreatedInput, UserUncheckedCreateWithoutExpensesCreatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutExpensesCreatedInput
    connect?: UserWhereUniqueInput
  }

  export type ExpenseParticipantCreateNestedManyWithoutExpenseInput = {
    create?: XOR<ExpenseParticipantCreateWithoutExpenseInput, ExpenseParticipantUncheckedCreateWithoutExpenseInput> | ExpenseParticipantCreateWithoutExpenseInput[] | ExpenseParticipantUncheckedCreateWithoutExpenseInput[]
    connectOrCreate?: ExpenseParticipantCreateOrConnectWithoutExpenseInput | ExpenseParticipantCreateOrConnectWithoutExpenseInput[]
    createMany?: ExpenseParticipantCreateManyExpenseInputEnvelope
    connect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
  }

  export type ExpenseParticipantUncheckedCreateNestedManyWithoutExpenseInput = {
    create?: XOR<ExpenseParticipantCreateWithoutExpenseInput, ExpenseParticipantUncheckedCreateWithoutExpenseInput> | ExpenseParticipantCreateWithoutExpenseInput[] | ExpenseParticipantUncheckedCreateWithoutExpenseInput[]
    connectOrCreate?: ExpenseParticipantCreateOrConnectWithoutExpenseInput | ExpenseParticipantCreateOrConnectWithoutExpenseInput[]
    createMany?: ExpenseParticipantCreateManyExpenseInputEnvelope
    connect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
  }

  export type GatheringUpdateOneRequiredWithoutExpensesNestedInput = {
    create?: XOR<GatheringCreateWithoutExpensesInput, GatheringUncheckedCreateWithoutExpensesInput>
    connectOrCreate?: GatheringCreateOrConnectWithoutExpensesInput
    upsert?: GatheringUpsertWithoutExpensesInput
    connect?: GatheringWhereUniqueInput
    update?: XOR<XOR<GatheringUpdateToOneWithWhereWithoutExpensesInput, GatheringUpdateWithoutExpensesInput>, GatheringUncheckedUpdateWithoutExpensesInput>
  }

  export type UserUpdateOneRequiredWithoutExpensesCreatedNestedInput = {
    create?: XOR<UserCreateWithoutExpensesCreatedInput, UserUncheckedCreateWithoutExpensesCreatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutExpensesCreatedInput
    upsert?: UserUpsertWithoutExpensesCreatedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExpensesCreatedInput, UserUpdateWithoutExpensesCreatedInput>, UserUncheckedUpdateWithoutExpensesCreatedInput>
  }

  export type ExpenseParticipantUpdateManyWithoutExpenseNestedInput = {
    create?: XOR<ExpenseParticipantCreateWithoutExpenseInput, ExpenseParticipantUncheckedCreateWithoutExpenseInput> | ExpenseParticipantCreateWithoutExpenseInput[] | ExpenseParticipantUncheckedCreateWithoutExpenseInput[]
    connectOrCreate?: ExpenseParticipantCreateOrConnectWithoutExpenseInput | ExpenseParticipantCreateOrConnectWithoutExpenseInput[]
    upsert?: ExpenseParticipantUpsertWithWhereUniqueWithoutExpenseInput | ExpenseParticipantUpsertWithWhereUniqueWithoutExpenseInput[]
    createMany?: ExpenseParticipantCreateManyExpenseInputEnvelope
    set?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    disconnect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    delete?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    connect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    update?: ExpenseParticipantUpdateWithWhereUniqueWithoutExpenseInput | ExpenseParticipantUpdateWithWhereUniqueWithoutExpenseInput[]
    updateMany?: ExpenseParticipantUpdateManyWithWhereWithoutExpenseInput | ExpenseParticipantUpdateManyWithWhereWithoutExpenseInput[]
    deleteMany?: ExpenseParticipantScalarWhereInput | ExpenseParticipantScalarWhereInput[]
  }

  export type ExpenseParticipantUncheckedUpdateManyWithoutExpenseNestedInput = {
    create?: XOR<ExpenseParticipantCreateWithoutExpenseInput, ExpenseParticipantUncheckedCreateWithoutExpenseInput> | ExpenseParticipantCreateWithoutExpenseInput[] | ExpenseParticipantUncheckedCreateWithoutExpenseInput[]
    connectOrCreate?: ExpenseParticipantCreateOrConnectWithoutExpenseInput | ExpenseParticipantCreateOrConnectWithoutExpenseInput[]
    upsert?: ExpenseParticipantUpsertWithWhereUniqueWithoutExpenseInput | ExpenseParticipantUpsertWithWhereUniqueWithoutExpenseInput[]
    createMany?: ExpenseParticipantCreateManyExpenseInputEnvelope
    set?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    disconnect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    delete?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    connect?: ExpenseParticipantWhereUniqueInput | ExpenseParticipantWhereUniqueInput[]
    update?: ExpenseParticipantUpdateWithWhereUniqueWithoutExpenseInput | ExpenseParticipantUpdateWithWhereUniqueWithoutExpenseInput[]
    updateMany?: ExpenseParticipantUpdateManyWithWhereWithoutExpenseInput | ExpenseParticipantUpdateManyWithWhereWithoutExpenseInput[]
    deleteMany?: ExpenseParticipantScalarWhereInput | ExpenseParticipantScalarWhereInput[]
  }

  export type ExpenseCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<ExpenseCreateWithoutParticipantsInput, ExpenseUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: ExpenseCreateOrConnectWithoutParticipantsInput
    connect?: ExpenseWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutExpenseParticipationsInput = {
    create?: XOR<UserCreateWithoutExpenseParticipationsInput, UserUncheckedCreateWithoutExpenseParticipationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExpenseParticipationsInput
    connect?: UserWhereUniqueInput
  }

  export type ExpenseUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<ExpenseCreateWithoutParticipantsInput, ExpenseUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: ExpenseCreateOrConnectWithoutParticipantsInput
    upsert?: ExpenseUpsertWithoutParticipantsInput
    connect?: ExpenseWhereUniqueInput
    update?: XOR<XOR<ExpenseUpdateToOneWithWhereWithoutParticipantsInput, ExpenseUpdateWithoutParticipantsInput>, ExpenseUncheckedUpdateWithoutParticipantsInput>
  }

  export type UserUpdateOneRequiredWithoutExpenseParticipationsNestedInput = {
    create?: XOR<UserCreateWithoutExpenseParticipationsInput, UserUncheckedCreateWithoutExpenseParticipationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExpenseParticipationsInput
    upsert?: UserUpsertWithoutExpenseParticipationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExpenseParticipationsInput, UserUpdateWithoutExpenseParticipationsInput>, UserUncheckedUpdateWithoutExpenseParticipationsInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type TransactionCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<TransactionCreateWithoutNotificationsInput, TransactionUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutNotificationsInput
    connect?: TransactionWhereUniqueInput
  }

  export type FriendshipCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<FriendshipCreateWithoutNotificationsInput, FriendshipUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: FriendshipCreateOrConnectWithoutNotificationsInput
    connect?: FriendshipWhereUniqueInput
  }

  export type GatheringCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<GatheringCreateWithoutNotificationsInput, GatheringUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: GatheringCreateOrConnectWithoutNotificationsInput
    connect?: GatheringWhereUniqueInput
  }

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type TransactionUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<TransactionCreateWithoutNotificationsInput, TransactionUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutNotificationsInput
    upsert?: TransactionUpsertWithoutNotificationsInput
    disconnect?: TransactionWhereInput | boolean
    delete?: TransactionWhereInput | boolean
    connect?: TransactionWhereUniqueInput
    update?: XOR<XOR<TransactionUpdateToOneWithWhereWithoutNotificationsInput, TransactionUpdateWithoutNotificationsInput>, TransactionUncheckedUpdateWithoutNotificationsInput>
  }

  export type FriendshipUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<FriendshipCreateWithoutNotificationsInput, FriendshipUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: FriendshipCreateOrConnectWithoutNotificationsInput
    upsert?: FriendshipUpsertWithoutNotificationsInput
    disconnect?: FriendshipWhereInput | boolean
    delete?: FriendshipWhereInput | boolean
    connect?: FriendshipWhereUniqueInput
    update?: XOR<XOR<FriendshipUpdateToOneWithWhereWithoutNotificationsInput, FriendshipUpdateWithoutNotificationsInput>, FriendshipUncheckedUpdateWithoutNotificationsInput>
  }

  export type GatheringUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<GatheringCreateWithoutNotificationsInput, GatheringUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: GatheringCreateOrConnectWithoutNotificationsInput
    upsert?: GatheringUpsertWithoutNotificationsInput
    disconnect?: GatheringWhereInput | boolean
    delete?: GatheringWhereInput | boolean
    connect?: GatheringWhereUniqueInput
    update?: XOR<XOR<GatheringUpdateToOneWithWhereWithoutNotificationsInput, GatheringUpdateWithoutNotificationsInput>, GatheringUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumFriendshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusFilter<$PrismaModel> | $Enums.FriendshipStatus
  }

  export type NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendshipStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendshipStatusFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type NestedEnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FriendshipCreateWithoutRequesterInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    addressee: UserCreateNestedOneWithoutFriendshipsReceivedInput
    notifications?: NotificationCreateNestedManyWithoutRelatedFriendshipInput
  }

  export type FriendshipUncheckedCreateWithoutRequesterInput = {
    id?: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedFriendshipInput
  }

  export type FriendshipCreateOrConnectWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput>
  }

  export type FriendshipCreateManyRequesterInputEnvelope = {
    data: FriendshipCreateManyRequesterInput | FriendshipCreateManyRequesterInput[]
    skipDuplicates?: boolean
  }

  export type FriendshipCreateWithoutAddresseeInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    requester: UserCreateNestedOneWithoutFriendshipsSentInput
    notifications?: NotificationCreateNestedManyWithoutRelatedFriendshipInput
  }

  export type FriendshipUncheckedCreateWithoutAddresseeInput = {
    id?: string
    requesterId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedFriendshipInput
  }

  export type FriendshipCreateOrConnectWithoutAddresseeInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput>
  }

  export type FriendshipCreateManyAddresseeInputEnvelope = {
    data: FriendshipCreateManyAddresseeInput | FriendshipCreateManyAddresseeInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutCreatorInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    debtor: UserCreateNestedOneWithoutTransactionsDebtorInput
    creditor: UserCreateNestedOneWithoutTransactionsCreditorInput
    confirmationFrom: UserCreateNestedOneWithoutTransactionsToConfirmInput
    notifications?: NotificationCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionUncheckedCreateWithoutCreatorInput = {
    id?: string
    debtorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionCreateOrConnectWithoutCreatorInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput>
  }

  export type TransactionCreateManyCreatorInputEnvelope = {
    data: TransactionCreateManyCreatorInput | TransactionCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutDebtorInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutTransactionsCreatedInput
    creditor: UserCreateNestedOneWithoutTransactionsCreditorInput
    confirmationFrom: UserCreateNestedOneWithoutTransactionsToConfirmInput
    notifications?: NotificationCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionUncheckedCreateWithoutDebtorInput = {
    id?: string
    creatorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionCreateOrConnectWithoutDebtorInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutDebtorInput, TransactionUncheckedCreateWithoutDebtorInput>
  }

  export type TransactionCreateManyDebtorInputEnvelope = {
    data: TransactionCreateManyDebtorInput | TransactionCreateManyDebtorInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutCreditorInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutTransactionsCreatedInput
    debtor: UserCreateNestedOneWithoutTransactionsDebtorInput
    confirmationFrom: UserCreateNestedOneWithoutTransactionsToConfirmInput
    notifications?: NotificationCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionUncheckedCreateWithoutCreditorInput = {
    id?: string
    creatorId: string
    debtorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionCreateOrConnectWithoutCreditorInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutCreditorInput, TransactionUncheckedCreateWithoutCreditorInput>
  }

  export type TransactionCreateManyCreditorInputEnvelope = {
    data: TransactionCreateManyCreditorInput | TransactionCreateManyCreditorInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutConfirmationFromInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutTransactionsCreatedInput
    debtor: UserCreateNestedOneWithoutTransactionsDebtorInput
    creditor: UserCreateNestedOneWithoutTransactionsCreditorInput
    notifications?: NotificationCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionUncheckedCreateWithoutConfirmationFromInput = {
    id?: string
    creatorId: string
    debtorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedTransactionInput
  }

  export type TransactionCreateOrConnectWithoutConfirmationFromInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutConfirmationFromInput, TransactionUncheckedCreateWithoutConfirmationFromInput>
  }

  export type TransactionCreateManyConfirmationFromInputEnvelope = {
    data: TransactionCreateManyConfirmationFromInput | TransactionCreateManyConfirmationFromInput[]
    skipDuplicates?: boolean
  }

  export type GatheringCreateWithoutCreatorInput = {
    id?: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    expenses?: ExpenseCreateNestedManyWithoutGatheringInput
    notifications?: NotificationCreateNestedManyWithoutRelatedGatheringInput
  }

  export type GatheringUncheckedCreateWithoutCreatorInput = {
    id?: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    expenses?: ExpenseUncheckedCreateNestedManyWithoutGatheringInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedGatheringInput
  }

  export type GatheringCreateOrConnectWithoutCreatorInput = {
    where: GatheringWhereUniqueInput
    create: XOR<GatheringCreateWithoutCreatorInput, GatheringUncheckedCreateWithoutCreatorInput>
  }

  export type GatheringCreateManyCreatorInputEnvelope = {
    data: GatheringCreateManyCreatorInput | GatheringCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type ExpenseCreateWithoutCreatorInput = {
    id?: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gathering: GatheringCreateNestedOneWithoutExpensesInput
    participants?: ExpenseParticipantCreateNestedManyWithoutExpenseInput
  }

  export type ExpenseUncheckedCreateWithoutCreatorInput = {
    id?: string
    gatheringId: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ExpenseParticipantUncheckedCreateNestedManyWithoutExpenseInput
  }

  export type ExpenseCreateOrConnectWithoutCreatorInput = {
    where: ExpenseWhereUniqueInput
    create: XOR<ExpenseCreateWithoutCreatorInput, ExpenseUncheckedCreateWithoutCreatorInput>
  }

  export type ExpenseCreateManyCreatorInputEnvelope = {
    data: ExpenseCreateManyCreatorInput | ExpenseCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type ExpenseParticipantCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    expense: ExpenseCreateNestedOneWithoutParticipantsInput
  }

  export type ExpenseParticipantUncheckedCreateWithoutUserInput = {
    id?: string
    expenseId: string
    createdAt?: Date | string
  }

  export type ExpenseParticipantCreateOrConnectWithoutUserInput = {
    where: ExpenseParticipantWhereUniqueInput
    create: XOR<ExpenseParticipantCreateWithoutUserInput, ExpenseParticipantUncheckedCreateWithoutUserInput>
  }

  export type ExpenseParticipantCreateManyUserInputEnvelope = {
    data: ExpenseParticipantCreateManyUserInput | ExpenseParticipantCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    createdAt?: Date | string
    relatedTransaction?: TransactionCreateNestedOneWithoutNotificationsInput
    relatedFriendship?: FriendshipCreateNestedOneWithoutNotificationsInput
    relatedGathering?: GatheringCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedTransactionId?: string | null
    relatedFriendshipId?: string | null
    relatedGatheringId?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FriendshipUpsertWithWhereUniqueWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    update: XOR<FriendshipUpdateWithoutRequesterInput, FriendshipUncheckedUpdateWithoutRequesterInput>
    create: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput>
  }

  export type FriendshipUpdateWithWhereUniqueWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    data: XOR<FriendshipUpdateWithoutRequesterInput, FriendshipUncheckedUpdateWithoutRequesterInput>
  }

  export type FriendshipUpdateManyWithWhereWithoutRequesterInput = {
    where: FriendshipScalarWhereInput
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyWithoutRequesterInput>
  }

  export type FriendshipScalarWhereInput = {
    AND?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
    OR?: FriendshipScalarWhereInput[]
    NOT?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
    id?: StringFilter<"Friendship"> | string
    requesterId?: StringFilter<"Friendship"> | string
    addresseeId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
  }

  export type FriendshipUpsertWithWhereUniqueWithoutAddresseeInput = {
    where: FriendshipWhereUniqueInput
    update: XOR<FriendshipUpdateWithoutAddresseeInput, FriendshipUncheckedUpdateWithoutAddresseeInput>
    create: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput>
  }

  export type FriendshipUpdateWithWhereUniqueWithoutAddresseeInput = {
    where: FriendshipWhereUniqueInput
    data: XOR<FriendshipUpdateWithoutAddresseeInput, FriendshipUncheckedUpdateWithoutAddresseeInput>
  }

  export type FriendshipUpdateManyWithWhereWithoutAddresseeInput = {
    where: FriendshipScalarWhereInput
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyWithoutAddresseeInput>
  }

  export type TransactionUpsertWithWhereUniqueWithoutCreatorInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutCreatorInput, TransactionUncheckedUpdateWithoutCreatorInput>
    create: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutCreatorInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutCreatorInput, TransactionUncheckedUpdateWithoutCreatorInput>
  }

  export type TransactionUpdateManyWithWhereWithoutCreatorInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutCreatorInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    creatorId?: StringFilter<"Transaction"> | string
    debtorId?: StringFilter<"Transaction"> | string
    creditorId?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Transaction"> | string
    description?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFilter<"Transaction"> | string
    occurredAt?: DateTimeFilter<"Transaction"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type TransactionUpsertWithWhereUniqueWithoutDebtorInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutDebtorInput, TransactionUncheckedUpdateWithoutDebtorInput>
    create: XOR<TransactionCreateWithoutDebtorInput, TransactionUncheckedCreateWithoutDebtorInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutDebtorInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutDebtorInput, TransactionUncheckedUpdateWithoutDebtorInput>
  }

  export type TransactionUpdateManyWithWhereWithoutDebtorInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutDebtorInput>
  }

  export type TransactionUpsertWithWhereUniqueWithoutCreditorInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutCreditorInput, TransactionUncheckedUpdateWithoutCreditorInput>
    create: XOR<TransactionCreateWithoutCreditorInput, TransactionUncheckedCreateWithoutCreditorInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutCreditorInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutCreditorInput, TransactionUncheckedUpdateWithoutCreditorInput>
  }

  export type TransactionUpdateManyWithWhereWithoutCreditorInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutCreditorInput>
  }

  export type TransactionUpsertWithWhereUniqueWithoutConfirmationFromInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutConfirmationFromInput, TransactionUncheckedUpdateWithoutConfirmationFromInput>
    create: XOR<TransactionCreateWithoutConfirmationFromInput, TransactionUncheckedCreateWithoutConfirmationFromInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutConfirmationFromInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutConfirmationFromInput, TransactionUncheckedUpdateWithoutConfirmationFromInput>
  }

  export type TransactionUpdateManyWithWhereWithoutConfirmationFromInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutConfirmationFromInput>
  }

  export type GatheringUpsertWithWhereUniqueWithoutCreatorInput = {
    where: GatheringWhereUniqueInput
    update: XOR<GatheringUpdateWithoutCreatorInput, GatheringUncheckedUpdateWithoutCreatorInput>
    create: XOR<GatheringCreateWithoutCreatorInput, GatheringUncheckedCreateWithoutCreatorInput>
  }

  export type GatheringUpdateWithWhereUniqueWithoutCreatorInput = {
    where: GatheringWhereUniqueInput
    data: XOR<GatheringUpdateWithoutCreatorInput, GatheringUncheckedUpdateWithoutCreatorInput>
  }

  export type GatheringUpdateManyWithWhereWithoutCreatorInput = {
    where: GatheringScalarWhereInput
    data: XOR<GatheringUpdateManyMutationInput, GatheringUncheckedUpdateManyWithoutCreatorInput>
  }

  export type GatheringScalarWhereInput = {
    AND?: GatheringScalarWhereInput | GatheringScalarWhereInput[]
    OR?: GatheringScalarWhereInput[]
    NOT?: GatheringScalarWhereInput | GatheringScalarWhereInput[]
    id?: StringFilter<"Gathering"> | string
    creatorId?: StringFilter<"Gathering"> | string
    name?: StringFilter<"Gathering"> | string
    description?: StringNullableFilter<"Gathering"> | string | null
    date?: DateTimeFilter<"Gathering"> | Date | string
    createdAt?: DateTimeFilter<"Gathering"> | Date | string
    updatedAt?: DateTimeFilter<"Gathering"> | Date | string
  }

  export type ExpenseUpsertWithWhereUniqueWithoutCreatorInput = {
    where: ExpenseWhereUniqueInput
    update: XOR<ExpenseUpdateWithoutCreatorInput, ExpenseUncheckedUpdateWithoutCreatorInput>
    create: XOR<ExpenseCreateWithoutCreatorInput, ExpenseUncheckedCreateWithoutCreatorInput>
  }

  export type ExpenseUpdateWithWhereUniqueWithoutCreatorInput = {
    where: ExpenseWhereUniqueInput
    data: XOR<ExpenseUpdateWithoutCreatorInput, ExpenseUncheckedUpdateWithoutCreatorInput>
  }

  export type ExpenseUpdateManyWithWhereWithoutCreatorInput = {
    where: ExpenseScalarWhereInput
    data: XOR<ExpenseUpdateManyMutationInput, ExpenseUncheckedUpdateManyWithoutCreatorInput>
  }

  export type ExpenseScalarWhereInput = {
    AND?: ExpenseScalarWhereInput | ExpenseScalarWhereInput[]
    OR?: ExpenseScalarWhereInput[]
    NOT?: ExpenseScalarWhereInput | ExpenseScalarWhereInput[]
    id?: StringFilter<"Expense"> | string
    gatheringId?: StringFilter<"Expense"> | string
    createdById?: StringFilter<"Expense"> | string
    title?: StringFilter<"Expense"> | string
    amount?: DecimalFilter<"Expense"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Expense"> | string
    createdAt?: DateTimeFilter<"Expense"> | Date | string
    updatedAt?: DateTimeFilter<"Expense"> | Date | string
  }

  export type ExpenseParticipantUpsertWithWhereUniqueWithoutUserInput = {
    where: ExpenseParticipantWhereUniqueInput
    update: XOR<ExpenseParticipantUpdateWithoutUserInput, ExpenseParticipantUncheckedUpdateWithoutUserInput>
    create: XOR<ExpenseParticipantCreateWithoutUserInput, ExpenseParticipantUncheckedCreateWithoutUserInput>
  }

  export type ExpenseParticipantUpdateWithWhereUniqueWithoutUserInput = {
    where: ExpenseParticipantWhereUniqueInput
    data: XOR<ExpenseParticipantUpdateWithoutUserInput, ExpenseParticipantUncheckedUpdateWithoutUserInput>
  }

  export type ExpenseParticipantUpdateManyWithWhereWithoutUserInput = {
    where: ExpenseParticipantScalarWhereInput
    data: XOR<ExpenseParticipantUpdateManyMutationInput, ExpenseParticipantUncheckedUpdateManyWithoutUserInput>
  }

  export type ExpenseParticipantScalarWhereInput = {
    AND?: ExpenseParticipantScalarWhereInput | ExpenseParticipantScalarWhereInput[]
    OR?: ExpenseParticipantScalarWhereInput[]
    NOT?: ExpenseParticipantScalarWhereInput | ExpenseParticipantScalarWhereInput[]
    id?: StringFilter<"ExpenseParticipant"> | string
    expenseId?: StringFilter<"ExpenseParticipant"> | string
    userId?: StringFilter<"ExpenseParticipant"> | string
    createdAt?: DateTimeFilter<"ExpenseParticipant"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    relatedTransactionId?: StringNullableFilter<"Notification"> | string | null
    relatedFriendshipId?: StringNullableFilter<"Notification"> | string | null
    relatedGatheringId?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserCreateWithoutFriendshipsSentInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFriendshipsSentInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFriendshipsSentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFriendshipsSentInput, UserUncheckedCreateWithoutFriendshipsSentInput>
  }

  export type UserCreateWithoutFriendshipsReceivedInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFriendshipsReceivedInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFriendshipsReceivedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFriendshipsReceivedInput, UserUncheckedCreateWithoutFriendshipsReceivedInput>
  }

  export type NotificationCreateWithoutRelatedFriendshipInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    relatedTransaction?: TransactionCreateNestedOneWithoutNotificationsInput
    relatedGathering?: GatheringCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutRelatedFriendshipInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedTransactionId?: string | null
    relatedGatheringId?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutRelatedFriendshipInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutRelatedFriendshipInput, NotificationUncheckedCreateWithoutRelatedFriendshipInput>
  }

  export type NotificationCreateManyRelatedFriendshipInputEnvelope = {
    data: NotificationCreateManyRelatedFriendshipInput | NotificationCreateManyRelatedFriendshipInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutFriendshipsSentInput = {
    update: XOR<UserUpdateWithoutFriendshipsSentInput, UserUncheckedUpdateWithoutFriendshipsSentInput>
    create: XOR<UserCreateWithoutFriendshipsSentInput, UserUncheckedCreateWithoutFriendshipsSentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFriendshipsSentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFriendshipsSentInput, UserUncheckedUpdateWithoutFriendshipsSentInput>
  }

  export type UserUpdateWithoutFriendshipsSentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFriendshipsSentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutFriendshipsReceivedInput = {
    update: XOR<UserUpdateWithoutFriendshipsReceivedInput, UserUncheckedUpdateWithoutFriendshipsReceivedInput>
    create: XOR<UserCreateWithoutFriendshipsReceivedInput, UserUncheckedCreateWithoutFriendshipsReceivedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFriendshipsReceivedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFriendshipsReceivedInput, UserUncheckedUpdateWithoutFriendshipsReceivedInput>
  }

  export type UserUpdateWithoutFriendshipsReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFriendshipsReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type NotificationUpsertWithWhereUniqueWithoutRelatedFriendshipInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutRelatedFriendshipInput, NotificationUncheckedUpdateWithoutRelatedFriendshipInput>
    create: XOR<NotificationCreateWithoutRelatedFriendshipInput, NotificationUncheckedCreateWithoutRelatedFriendshipInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutRelatedFriendshipInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutRelatedFriendshipInput, NotificationUncheckedUpdateWithoutRelatedFriendshipInput>
  }

  export type NotificationUpdateManyWithWhereWithoutRelatedFriendshipInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutRelatedFriendshipInput>
  }

  export type UserCreateWithoutTransactionsCreatedInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsCreatedInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsCreatedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsCreatedInput, UserUncheckedCreateWithoutTransactionsCreatedInput>
  }

  export type UserCreateWithoutTransactionsDebtorInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsDebtorInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsDebtorInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsDebtorInput, UserUncheckedCreateWithoutTransactionsDebtorInput>
  }

  export type UserCreateWithoutTransactionsCreditorInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsCreditorInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsCreditorInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsCreditorInput, UserUncheckedCreateWithoutTransactionsCreditorInput>
  }

  export type UserCreateWithoutTransactionsToConfirmInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsToConfirmInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsToConfirmInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsToConfirmInput, UserUncheckedCreateWithoutTransactionsToConfirmInput>
  }

  export type NotificationCreateWithoutRelatedTransactionInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    relatedFriendship?: FriendshipCreateNestedOneWithoutNotificationsInput
    relatedGathering?: GatheringCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutRelatedTransactionInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedFriendshipId?: string | null
    relatedGatheringId?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutRelatedTransactionInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutRelatedTransactionInput, NotificationUncheckedCreateWithoutRelatedTransactionInput>
  }

  export type NotificationCreateManyRelatedTransactionInputEnvelope = {
    data: NotificationCreateManyRelatedTransactionInput | NotificationCreateManyRelatedTransactionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTransactionsCreatedInput = {
    update: XOR<UserUpdateWithoutTransactionsCreatedInput, UserUncheckedUpdateWithoutTransactionsCreatedInput>
    create: XOR<UserCreateWithoutTransactionsCreatedInput, UserUncheckedCreateWithoutTransactionsCreatedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsCreatedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsCreatedInput, UserUncheckedUpdateWithoutTransactionsCreatedInput>
  }

  export type UserUpdateWithoutTransactionsCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutTransactionsDebtorInput = {
    update: XOR<UserUpdateWithoutTransactionsDebtorInput, UserUncheckedUpdateWithoutTransactionsDebtorInput>
    create: XOR<UserCreateWithoutTransactionsDebtorInput, UserUncheckedCreateWithoutTransactionsDebtorInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsDebtorInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsDebtorInput, UserUncheckedUpdateWithoutTransactionsDebtorInput>
  }

  export type UserUpdateWithoutTransactionsDebtorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsDebtorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutTransactionsCreditorInput = {
    update: XOR<UserUpdateWithoutTransactionsCreditorInput, UserUncheckedUpdateWithoutTransactionsCreditorInput>
    create: XOR<UserCreateWithoutTransactionsCreditorInput, UserUncheckedCreateWithoutTransactionsCreditorInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsCreditorInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsCreditorInput, UserUncheckedUpdateWithoutTransactionsCreditorInput>
  }

  export type UserUpdateWithoutTransactionsCreditorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsCreditorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutTransactionsToConfirmInput = {
    update: XOR<UserUpdateWithoutTransactionsToConfirmInput, UserUncheckedUpdateWithoutTransactionsToConfirmInput>
    create: XOR<UserCreateWithoutTransactionsToConfirmInput, UserUncheckedCreateWithoutTransactionsToConfirmInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsToConfirmInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsToConfirmInput, UserUncheckedUpdateWithoutTransactionsToConfirmInput>
  }

  export type UserUpdateWithoutTransactionsToConfirmInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsToConfirmInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type NotificationUpsertWithWhereUniqueWithoutRelatedTransactionInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutRelatedTransactionInput, NotificationUncheckedUpdateWithoutRelatedTransactionInput>
    create: XOR<NotificationCreateWithoutRelatedTransactionInput, NotificationUncheckedCreateWithoutRelatedTransactionInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutRelatedTransactionInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutRelatedTransactionInput, NotificationUncheckedUpdateWithoutRelatedTransactionInput>
  }

  export type NotificationUpdateManyWithWhereWithoutRelatedTransactionInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutRelatedTransactionInput>
  }

  export type UserCreateWithoutGatheringsInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGatheringsInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGatheringsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGatheringsInput, UserUncheckedCreateWithoutGatheringsInput>
  }

  export type ExpenseCreateWithoutGatheringInput = {
    id?: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutExpensesCreatedInput
    participants?: ExpenseParticipantCreateNestedManyWithoutExpenseInput
  }

  export type ExpenseUncheckedCreateWithoutGatheringInput = {
    id?: string
    createdById: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ExpenseParticipantUncheckedCreateNestedManyWithoutExpenseInput
  }

  export type ExpenseCreateOrConnectWithoutGatheringInput = {
    where: ExpenseWhereUniqueInput
    create: XOR<ExpenseCreateWithoutGatheringInput, ExpenseUncheckedCreateWithoutGatheringInput>
  }

  export type ExpenseCreateManyGatheringInputEnvelope = {
    data: ExpenseCreateManyGatheringInput | ExpenseCreateManyGatheringInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutRelatedGatheringInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    relatedTransaction?: TransactionCreateNestedOneWithoutNotificationsInput
    relatedFriendship?: FriendshipCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutRelatedGatheringInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedTransactionId?: string | null
    relatedFriendshipId?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutRelatedGatheringInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutRelatedGatheringInput, NotificationUncheckedCreateWithoutRelatedGatheringInput>
  }

  export type NotificationCreateManyRelatedGatheringInputEnvelope = {
    data: NotificationCreateManyRelatedGatheringInput | NotificationCreateManyRelatedGatheringInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutGatheringsInput = {
    update: XOR<UserUpdateWithoutGatheringsInput, UserUncheckedUpdateWithoutGatheringsInput>
    create: XOR<UserCreateWithoutGatheringsInput, UserUncheckedCreateWithoutGatheringsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGatheringsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGatheringsInput, UserUncheckedUpdateWithoutGatheringsInput>
  }

  export type UserUpdateWithoutGatheringsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGatheringsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExpenseUpsertWithWhereUniqueWithoutGatheringInput = {
    where: ExpenseWhereUniqueInput
    update: XOR<ExpenseUpdateWithoutGatheringInput, ExpenseUncheckedUpdateWithoutGatheringInput>
    create: XOR<ExpenseCreateWithoutGatheringInput, ExpenseUncheckedCreateWithoutGatheringInput>
  }

  export type ExpenseUpdateWithWhereUniqueWithoutGatheringInput = {
    where: ExpenseWhereUniqueInput
    data: XOR<ExpenseUpdateWithoutGatheringInput, ExpenseUncheckedUpdateWithoutGatheringInput>
  }

  export type ExpenseUpdateManyWithWhereWithoutGatheringInput = {
    where: ExpenseScalarWhereInput
    data: XOR<ExpenseUpdateManyMutationInput, ExpenseUncheckedUpdateManyWithoutGatheringInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutRelatedGatheringInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutRelatedGatheringInput, NotificationUncheckedUpdateWithoutRelatedGatheringInput>
    create: XOR<NotificationCreateWithoutRelatedGatheringInput, NotificationUncheckedCreateWithoutRelatedGatheringInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutRelatedGatheringInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutRelatedGatheringInput, NotificationUncheckedUpdateWithoutRelatedGatheringInput>
  }

  export type NotificationUpdateManyWithWhereWithoutRelatedGatheringInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutRelatedGatheringInput>
  }

  export type GatheringCreateWithoutExpensesInput = {
    id?: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutGatheringsInput
    notifications?: NotificationCreateNestedManyWithoutRelatedGatheringInput
  }

  export type GatheringUncheckedCreateWithoutExpensesInput = {
    id?: string
    creatorId: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutRelatedGatheringInput
  }

  export type GatheringCreateOrConnectWithoutExpensesInput = {
    where: GatheringWhereUniqueInput
    create: XOR<GatheringCreateWithoutExpensesInput, GatheringUncheckedCreateWithoutExpensesInput>
  }

  export type UserCreateWithoutExpensesCreatedInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExpensesCreatedInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExpensesCreatedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExpensesCreatedInput, UserUncheckedCreateWithoutExpensesCreatedInput>
  }

  export type ExpenseParticipantCreateWithoutExpenseInput = {
    id?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutExpenseParticipationsInput
  }

  export type ExpenseParticipantUncheckedCreateWithoutExpenseInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type ExpenseParticipantCreateOrConnectWithoutExpenseInput = {
    where: ExpenseParticipantWhereUniqueInput
    create: XOR<ExpenseParticipantCreateWithoutExpenseInput, ExpenseParticipantUncheckedCreateWithoutExpenseInput>
  }

  export type ExpenseParticipantCreateManyExpenseInputEnvelope = {
    data: ExpenseParticipantCreateManyExpenseInput | ExpenseParticipantCreateManyExpenseInput[]
    skipDuplicates?: boolean
  }

  export type GatheringUpsertWithoutExpensesInput = {
    update: XOR<GatheringUpdateWithoutExpensesInput, GatheringUncheckedUpdateWithoutExpensesInput>
    create: XOR<GatheringCreateWithoutExpensesInput, GatheringUncheckedCreateWithoutExpensesInput>
    where?: GatheringWhereInput
  }

  export type GatheringUpdateToOneWithWhereWithoutExpensesInput = {
    where?: GatheringWhereInput
    data: XOR<GatheringUpdateWithoutExpensesInput, GatheringUncheckedUpdateWithoutExpensesInput>
  }

  export type GatheringUpdateWithoutExpensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutGatheringsNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedGatheringNestedInput
  }

  export type GatheringUncheckedUpdateWithoutExpensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedGatheringNestedInput
  }

  export type UserUpsertWithoutExpensesCreatedInput = {
    update: XOR<UserUpdateWithoutExpensesCreatedInput, UserUncheckedUpdateWithoutExpensesCreatedInput>
    create: XOR<UserCreateWithoutExpensesCreatedInput, UserUncheckedCreateWithoutExpensesCreatedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExpensesCreatedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExpensesCreatedInput, UserUncheckedUpdateWithoutExpensesCreatedInput>
  }

  export type UserUpdateWithoutExpensesCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExpensesCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExpenseParticipantUpsertWithWhereUniqueWithoutExpenseInput = {
    where: ExpenseParticipantWhereUniqueInput
    update: XOR<ExpenseParticipantUpdateWithoutExpenseInput, ExpenseParticipantUncheckedUpdateWithoutExpenseInput>
    create: XOR<ExpenseParticipantCreateWithoutExpenseInput, ExpenseParticipantUncheckedCreateWithoutExpenseInput>
  }

  export type ExpenseParticipantUpdateWithWhereUniqueWithoutExpenseInput = {
    where: ExpenseParticipantWhereUniqueInput
    data: XOR<ExpenseParticipantUpdateWithoutExpenseInput, ExpenseParticipantUncheckedUpdateWithoutExpenseInput>
  }

  export type ExpenseParticipantUpdateManyWithWhereWithoutExpenseInput = {
    where: ExpenseParticipantScalarWhereInput
    data: XOR<ExpenseParticipantUpdateManyMutationInput, ExpenseParticipantUncheckedUpdateManyWithoutExpenseInput>
  }

  export type ExpenseCreateWithoutParticipantsInput = {
    id?: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gathering: GatheringCreateNestedOneWithoutExpensesInput
    creator: UserCreateNestedOneWithoutExpensesCreatedInput
  }

  export type ExpenseUncheckedCreateWithoutParticipantsInput = {
    id?: string
    gatheringId: string
    createdById: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExpenseCreateOrConnectWithoutParticipantsInput = {
    where: ExpenseWhereUniqueInput
    create: XOR<ExpenseCreateWithoutParticipantsInput, ExpenseUncheckedCreateWithoutParticipantsInput>
  }

  export type UserCreateWithoutExpenseParticipationsInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExpenseParticipationsInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExpenseParticipationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExpenseParticipationsInput, UserUncheckedCreateWithoutExpenseParticipationsInput>
  }

  export type ExpenseUpsertWithoutParticipantsInput = {
    update: XOR<ExpenseUpdateWithoutParticipantsInput, ExpenseUncheckedUpdateWithoutParticipantsInput>
    create: XOR<ExpenseCreateWithoutParticipantsInput, ExpenseUncheckedCreateWithoutParticipantsInput>
    where?: ExpenseWhereInput
  }

  export type ExpenseUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: ExpenseWhereInput
    data: XOR<ExpenseUpdateWithoutParticipantsInput, ExpenseUncheckedUpdateWithoutParticipantsInput>
  }

  export type ExpenseUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gathering?: GatheringUpdateOneRequiredWithoutExpensesNestedInput
    creator?: UserUpdateOneRequiredWithoutExpensesCreatedNestedInput
  }

  export type ExpenseUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    gatheringId?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutExpenseParticipationsInput = {
    update: XOR<UserUpdateWithoutExpenseParticipationsInput, UserUncheckedUpdateWithoutExpenseParticipationsInput>
    create: XOR<UserCreateWithoutExpenseParticipationsInput, UserUncheckedCreateWithoutExpenseParticipationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExpenseParticipationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExpenseParticipationsInput, UserUncheckedUpdateWithoutExpenseParticipationsInput>
  }

  export type UserUpdateWithoutExpenseParticipationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExpenseParticipationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    name: string
    username: string
    email: string
    password: string
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    friendshipsSent?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    friendshipsReceived?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    transactionsCreated?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
    transactionsDebtor?: TransactionUncheckedCreateNestedManyWithoutDebtorInput
    transactionsCreditor?: TransactionUncheckedCreateNestedManyWithoutCreditorInput
    transactionsToConfirm?: TransactionUncheckedCreateNestedManyWithoutConfirmationFromInput
    gatherings?: GatheringUncheckedCreateNestedManyWithoutCreatorInput
    expensesCreated?: ExpenseUncheckedCreateNestedManyWithoutCreatorInput
    expenseParticipations?: ExpenseParticipantUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type TransactionCreateWithoutNotificationsInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutTransactionsCreatedInput
    debtor: UserCreateNestedOneWithoutTransactionsDebtorInput
    creditor: UserCreateNestedOneWithoutTransactionsCreditorInput
    confirmationFrom: UserCreateNestedOneWithoutTransactionsToConfirmInput
  }

  export type TransactionUncheckedCreateWithoutNotificationsInput = {
    id?: string
    creatorId: string
    debtorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutNotificationsInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutNotificationsInput, TransactionUncheckedCreateWithoutNotificationsInput>
  }

  export type FriendshipCreateWithoutNotificationsInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    requester: UserCreateNestedOneWithoutFriendshipsSentInput
    addressee: UserCreateNestedOneWithoutFriendshipsReceivedInput
  }

  export type FriendshipUncheckedCreateWithoutNotificationsInput = {
    id?: string
    requesterId: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateOrConnectWithoutNotificationsInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutNotificationsInput, FriendshipUncheckedCreateWithoutNotificationsInput>
  }

  export type GatheringCreateWithoutNotificationsInput = {
    id?: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: UserCreateNestedOneWithoutGatheringsInput
    expenses?: ExpenseCreateNestedManyWithoutGatheringInput
  }

  export type GatheringUncheckedCreateWithoutNotificationsInput = {
    id?: string
    creatorId: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    expenses?: ExpenseUncheckedCreateNestedManyWithoutGatheringInput
  }

  export type GatheringCreateOrConnectWithoutNotificationsInput = {
    where: GatheringWhereUniqueInput
    create: XOR<GatheringCreateWithoutNotificationsInput, GatheringUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friendshipsSent?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    friendshipsReceived?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    transactionsCreated?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
    transactionsDebtor?: TransactionUncheckedUpdateManyWithoutDebtorNestedInput
    transactionsCreditor?: TransactionUncheckedUpdateManyWithoutCreditorNestedInput
    transactionsToConfirm?: TransactionUncheckedUpdateManyWithoutConfirmationFromNestedInput
    gatherings?: GatheringUncheckedUpdateManyWithoutCreatorNestedInput
    expensesCreated?: ExpenseUncheckedUpdateManyWithoutCreatorNestedInput
    expenseParticipations?: ExpenseParticipantUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TransactionUpsertWithoutNotificationsInput = {
    update: XOR<TransactionUpdateWithoutNotificationsInput, TransactionUncheckedUpdateWithoutNotificationsInput>
    create: XOR<TransactionCreateWithoutNotificationsInput, TransactionUncheckedCreateWithoutNotificationsInput>
    where?: TransactionWhereInput
  }

  export type TransactionUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: TransactionWhereInput
    data: XOR<TransactionUpdateWithoutNotificationsInput, TransactionUncheckedUpdateWithoutNotificationsInput>
  }

  export type TransactionUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutTransactionsCreatedNestedInput
    debtor?: UserUpdateOneRequiredWithoutTransactionsDebtorNestedInput
    creditor?: UserUpdateOneRequiredWithoutTransactionsCreditorNestedInput
    confirmationFrom?: UserUpdateOneRequiredWithoutTransactionsToConfirmNestedInput
  }

  export type TransactionUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUpsertWithoutNotificationsInput = {
    update: XOR<FriendshipUpdateWithoutNotificationsInput, FriendshipUncheckedUpdateWithoutNotificationsInput>
    create: XOR<FriendshipCreateWithoutNotificationsInput, FriendshipUncheckedCreateWithoutNotificationsInput>
    where?: FriendshipWhereInput
  }

  export type FriendshipUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: FriendshipWhereInput
    data: XOR<FriendshipUpdateWithoutNotificationsInput, FriendshipUncheckedUpdateWithoutNotificationsInput>
  }

  export type FriendshipUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requester?: UserUpdateOneRequiredWithoutFriendshipsSentNestedInput
    addressee?: UserUpdateOneRequiredWithoutFriendshipsReceivedNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GatheringUpsertWithoutNotificationsInput = {
    update: XOR<GatheringUpdateWithoutNotificationsInput, GatheringUncheckedUpdateWithoutNotificationsInput>
    create: XOR<GatheringCreateWithoutNotificationsInput, GatheringUncheckedCreateWithoutNotificationsInput>
    where?: GatheringWhereInput
  }

  export type GatheringUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: GatheringWhereInput
    data: XOR<GatheringUpdateWithoutNotificationsInput, GatheringUncheckedUpdateWithoutNotificationsInput>
  }

  export type GatheringUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutGatheringsNestedInput
    expenses?: ExpenseUpdateManyWithoutGatheringNestedInput
  }

  export type GatheringUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expenses?: ExpenseUncheckedUpdateManyWithoutGatheringNestedInput
  }

  export type FriendshipCreateManyRequesterInput = {
    id?: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateManyAddresseeInput = {
    id?: string
    requesterId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyCreatorInput = {
    id?: string
    debtorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyDebtorInput = {
    id?: string
    creatorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyCreditorInput = {
    id?: string
    creatorId: string
    debtorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    pendingConfirmationFromId: string
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyConfirmationFromInput = {
    id?: string
    creatorId: string
    debtorId: string
    creditorId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    description: string
    type: $Enums.TransactionType
    status?: $Enums.TransactionStatus
    occurredAt?: Date | string
    confirmedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GatheringCreateManyCreatorInput = {
    id?: string
    name: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExpenseCreateManyCreatorInput = {
    id?: string
    gatheringId: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExpenseParticipantCreateManyUserInput = {
    id?: string
    expenseId: string
    createdAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedTransactionId?: string | null
    relatedFriendshipId?: string | null
    relatedGatheringId?: string | null
    createdAt?: Date | string
  }

  export type FriendshipUpdateWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    addressee?: UserUpdateOneRequiredWithoutFriendshipsReceivedNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedFriendshipNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedFriendshipNestedInput
  }

  export type FriendshipUncheckedUpdateManyWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUpdateWithoutAddresseeInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requester?: UserUpdateOneRequiredWithoutFriendshipsSentNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedFriendshipNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutAddresseeInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedFriendshipNestedInput
  }

  export type FriendshipUncheckedUpdateManyWithoutAddresseeInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    debtor?: UserUpdateOneRequiredWithoutTransactionsDebtorNestedInput
    creditor?: UserUpdateOneRequiredWithoutTransactionsCreditorNestedInput
    confirmationFrom?: UserUpdateOneRequiredWithoutTransactionsToConfirmNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutDebtorInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutTransactionsCreatedNestedInput
    creditor?: UserUpdateOneRequiredWithoutTransactionsCreditorNestedInput
    confirmationFrom?: UserUpdateOneRequiredWithoutTransactionsToConfirmNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutDebtorInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutDebtorInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutCreditorInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutTransactionsCreatedNestedInput
    debtor?: UserUpdateOneRequiredWithoutTransactionsDebtorNestedInput
    confirmationFrom?: UserUpdateOneRequiredWithoutTransactionsToConfirmNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutCreditorInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutCreditorInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    pendingConfirmationFromId?: StringFieldUpdateOperationsInput | string
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutConfirmationFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutTransactionsCreatedNestedInput
    debtor?: UserUpdateOneRequiredWithoutTransactionsDebtorNestedInput
    creditor?: UserUpdateOneRequiredWithoutTransactionsCreditorNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutConfirmationFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutConfirmationFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    debtorId?: StringFieldUpdateOperationsInput | string
    creditorId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GatheringUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expenses?: ExpenseUpdateManyWithoutGatheringNestedInput
    notifications?: NotificationUpdateManyWithoutRelatedGatheringNestedInput
  }

  export type GatheringUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expenses?: ExpenseUncheckedUpdateManyWithoutGatheringNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutRelatedGatheringNestedInput
  }

  export type GatheringUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gathering?: GatheringUpdateOneRequiredWithoutExpensesNestedInput
    participants?: ExpenseParticipantUpdateManyWithoutExpenseNestedInput
  }

  export type ExpenseUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    gatheringId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ExpenseParticipantUncheckedUpdateManyWithoutExpenseNestedInput
  }

  export type ExpenseUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    gatheringId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseParticipantUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expense?: ExpenseUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type ExpenseParticipantUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseParticipantUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relatedTransaction?: TransactionUpdateOneWithoutNotificationsNestedInput
    relatedFriendship?: FriendshipUpdateOneWithoutNotificationsNestedInput
    relatedGathering?: GatheringUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedFriendshipId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedGatheringId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedFriendshipId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedGatheringId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyRelatedFriendshipInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedTransactionId?: string | null
    relatedGatheringId?: string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateWithoutRelatedFriendshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    relatedTransaction?: TransactionUpdateOneWithoutNotificationsNestedInput
    relatedGathering?: GatheringUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutRelatedFriendshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedGatheringId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutRelatedFriendshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedGatheringId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyRelatedTransactionInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedFriendshipId?: string | null
    relatedGatheringId?: string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateWithoutRelatedTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    relatedFriendship?: FriendshipUpdateOneWithoutNotificationsNestedInput
    relatedGathering?: GatheringUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutRelatedTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedFriendshipId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedGatheringId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutRelatedTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedFriendshipId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedGatheringId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseCreateManyGatheringInput = {
    id?: string
    createdById: string
    title: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyRelatedGatheringInput = {
    id?: string
    userId: string
    type: $Enums.NotificationType
    title: string
    body: string
    read?: boolean
    relatedTransactionId?: string | null
    relatedFriendshipId?: string | null
    createdAt?: Date | string
  }

  export type ExpenseUpdateWithoutGatheringInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutExpensesCreatedNestedInput
    participants?: ExpenseParticipantUpdateManyWithoutExpenseNestedInput
  }

  export type ExpenseUncheckedUpdateWithoutGatheringInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ExpenseParticipantUncheckedUpdateManyWithoutExpenseNestedInput
  }

  export type ExpenseUncheckedUpdateManyWithoutGatheringInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutRelatedGatheringInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    relatedTransaction?: TransactionUpdateOneWithoutNotificationsNestedInput
    relatedFriendship?: FriendshipUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutRelatedGatheringInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedFriendshipId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutRelatedGatheringInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    relatedTransactionId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedFriendshipId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseParticipantCreateManyExpenseInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type ExpenseParticipantUpdateWithoutExpenseInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutExpenseParticipationsNestedInput
  }

  export type ExpenseParticipantUncheckedUpdateWithoutExpenseInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpenseParticipantUncheckedUpdateManyWithoutExpenseInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}