declare module '@byteinspire/db' {
  import { ObjectId } from 'bson'
  export default DbSDK

  const DbSDK: SDK.ISDK
  export type API = SDK.IDBSDK
  export type ITable<T = unknown> = SDK.ITable<T>

  namespace SDK {
    interface ISDK {
      createDbSDK(serviceId: string, axiosInstance: unknown): IDBSDK
    }

    interface IDBSDK {
      table<DBModel = unknown>(tableName: string): ITable<DBModel>

      ObjectId: typeof ObjectId

      eq(data: unknown): IDBSDK
      ne(data: unknown): IDBSDK
      gt(data: unknown): IDBSDK
      gte(data: unknown): IDBSDK
      lt(data: unknown): IDBSDK
      lte(data: unknown): IDBSDK
      in(data: unknown[]): IDBSDK
      nin(data: unknown[]): IDBSDK

      and(...data: unknown[]): IDBSDK
      or(...data: unknown[]): IDBSDK
      nor(...data: unknown[]): IDBSDK
      not(data: unknown): IDBSDK

      exists(existance: boolean): IDBSDK
      mod(modExpr: [number, number]): IDBSDK
      mod(expr: [unknown, unknown]): IDBSDK
      regex(reg: RegExp): IDBSDK
      all(element: unknown[]): IDBSDK
      elemMatch(expr: unknown): IDBSDK
      size(n: number): IDBSDK

      bitsAllClear(bitPos: number[]): IDBSDK
      bitsAllSet(bitPos: number[]): IDBSDK
      bitsAnyClear(bitPos: number[]): IDBSDK
      bitsAnySet(bitPos: number[]): IDBSDK

      geoIntersects(geoObjExpr: unknown): IDBSDK
      geoWithin(geoObjExpr: unknown): IDBSDK
      near(geoObjExpr: unknown): IDBSDK
      nearSphere(geoObjExpr: unknown): IDBSDK

      literal(constant: unknown): IDBSDK

      abs(expr: unknown): IDBSDK
      add(exprs: unknown[]): IDBSDK
      cmp(expr: [unknown, unknown]): IDBSDK
      ceil(expr: unknown): IDBSDK
      divide(expr: [unknown, unknown]): IDBSDK
      exp(expr: unknown): IDBSDK
      floor(expr: unknown): IDBSDK
      ln(expr: unknown): IDBSDK
      log(expr: [unknown, unknown]): IDBSDK
      log10(expr: unknown): IDBSDK
      multiply(expr: unknown[]): IDBSDK
      pow(expr: [unknown, unknown]): IDBSDK
      round(expr: unknown): IDBSDK
      sqrt(expr: unknown): IDBSDK
      subtract(expr: [unknown, unknown]): IDBSDK
      cond(condIfElse: [unknown, unknown, unknown]): IDBSDK
      ifNull(condIfNull: [unknown, unknown]): IDBSDK
      switch(branches: {
        cases: { case: unknown; then: unknown }[]
        default: unknown
      }): IDBSDK

      dayOfMonth(expr: unknown): IDBSDK
      dayOfWeek(expr: unknown): IDBSDK
      dayOfYear(expr: unknown): IDBSDK
      hour(expr: unknown): IDBSDK
      millisecond(expr: unknown): IDBSDK
      minute(expr: unknown): IDBSDK
      month(expr: unknown): IDBSDK
      second(expr: unknown): IDBSDK
      week(expr: unknown): IDBSDK
      year(expr: unknown): IDBSDK

      concat(expr: unknown[]): IDBSDK
      dateFromString(expr: {
        dateString: string
        format: string
        timezone: string
        onError: unknown
        onNull: unknown
      }): IDBSDK

      dateToString(expr: {
        format: string
        date: string
        timezone: string
        onError: unknown
      }): IDBSDK
      indexOfBytes(expr: [unknown, unknown, number, number]): IDBSDK
      indexOfCP(expr: [unknown, unknown, number, number]): IDBSDK
      ltrim(expr: unknown): IDBSDK
      rtrim(expr: unknown): IDBSDK
      split(expr: [unknown, string]): IDBSDK
      strLenBytes(expr: unknown): IDBSDK
      strLenCP(expr: unknown): IDBSDK
      strcasecmp(expr: unknown[]): IDBSDK
      substrBytes(expr: [unknown, number, number]): IDBSDK
      substrCP(expr: [unknown, number, number]): IDBSDK
      toLower(expr: unknown): IDBSDK
      toString(expr: unknown): IDBSDK
      toUpper(expr: unknown): IDBSDK
      trim(expr: unknown): IDBSDK
    }

    interface IEntity {
      _id: ObjectId
      createdAt: Date
      updatedAt: Date
    }

    interface ITable<DBModel = unknown> {
      create<T extends Partial<DBModel>>(obj: T): T & IEntity
      create<T extends Partial<DBModel>>(obj: T[]): (T & IEntity)[]
      save<T extends Partial<DBModel>>(obj: T): Promise<T & IEntity>
      save<T extends Partial<DBModel>>(obj: T[]): Promise<(T & IEntity)[]>
      where(field: string): IQuery<DBModel>
      where(filter: unknown): IQuery<DBModel>
      where(): IQuery<DBModel>
      delete(obj: Partial<DBModel> | Partial<DBModel>[]): Promise<{
        result: { deletedCount: number }
      }>
    }

    interface ISet {
      upsert(): ISet
      save(): Promise<{
        updatedCount: number
        upsertedCount: number
        upsertedId: ObjectId | null
      }>
      // 注意，Set 这里只有 limit 可以用。skip, sort 等都无效。
      limit(n: number): ISet

      set(value: unknown): ISet
      setOnInsert(value: unknown): ISet
      to(value: unknown): ISet
      max(value: number): ISet
      min(value: number): ISet
      mul(value: number): ISet
      multiply(value: number): ISet
      multiply(value: number): ISet
      inc(value: number): ISet
      increment(value: number): ISet
      currentDate(): ISet
      rename(column: string): ISet
    }

    interface IAggregationQuery {
      find(): Promise<unknown[]>
      findOne(): Promise<unknown>
      count(): Promise<number>
      where(): IQuery<unknown>
      where(field: string): IQuery<unknown>
      where(filter: unknown): IQuery<unknown>

      sum(field: string): IAggregationQuery
      sum(exp: unknown): IAggregationQuery
      as(field: string): IAggregationQuery
      avg(field: string): IAggregationQuery
      avg(exp: unknown): IAggregationQuery
      max(field: string): IAggregationQuery
      max(exp: unknown): IAggregationQuery
      min(field: string): IAggregationQuery
      min(exp: unknown): IAggregationQuery
      mul(field: string): IAggregationQuery
      mul(exp: unknown): IAggregationQuery
      stdDevPop(field: string): IAggregationQuery
      stdDevPop(exp: unknown): IAggregationQuery
      stdDevSamp(field: string): IAggregationQuery
      stdDevSamp(exp: unknown): IAggregationQuery
      first(field: string): IAggregationQuery
      first(exp: unknown): IAggregationQuery
      last(field: string): IAggregationQuery
      last(exp: unknown): IAggregationQuery
      num(): IAggregationQuery

      mergeToArray(field: unknown): IAggregationQuery
      mergeToSet(field: unknown): IAggregationQuery
      mergeToObject(field: unknown): IAggregationQuery
    }

    interface IPopulateOption<DBModel, RefKey extends keyof DBModel> {
      ref: RefKey
      populate?: unknown
    }

    interface IQuery<DBModel = unknown> {
      count(): Promise<number>
      find(): Promise<Array<DBModel & IEntity>>
      findOne(): Promise<DBModel & IEntity>
      delete(): Promise<{
        result: { deletedCount: number }
      }>
      limit(value: number): IQuery<DBModel>
      skip(value: number): IQuery<DBModel>
      sort(
        value: Partial<Record<keyof (DBModel & IEntity), -1 | 1>>
      ): IQuery<DBModel>
      projection(
        filter: Partial<Record<keyof (DBModel & IEntity), 1 | -1>>
      ): IQuery<unknown>
      where(value: unknown): IQuery<DBModel>

      or(...filter: unknown[]): IQuery<DBModel>
      and(...filter: unknown[]): IQuery<DBModel>
      nor(...filter: unknown[]): IQuery<DBModel>

      populate(field: keyof DBModel): IQuery<DBModel>
      populate<Field extends keyof DBModel>(
        option: IPopulateOption<DBModel, Field>
      ): IQuery<DBModel>
      populate(fieldOrOptions: unknown[]): IQuery<DBModel>

      // start a IAggregationQuery
      groupBy(o: unknown): IAggregationQuery
      groupBy(): IAggregationQuery

      // start a ISet
      set(value?: string): ISet
      set(object: Partial<DBModel>): ISet
      replace(value: unknown): ISet

      // operations
      gt(value: unknown): IQuery<DBModel>
      greaterThan(value: unknown): IQuery<DBModel>
      gte(value: unknown): IQuery<DBModel>
      greaterThanOrEquals(value: unknown): IQuery<DBModel>
      lt(value: unknown): IQuery<DBModel>
      lessThan(value: unknown): IQuery<DBModel>
      lte(value: unknown): IQuery<DBModel>
      lessThanOrEquals(value: unknown): IQuery<DBModel>
      eq(value: unknown): IQuery<DBModel>
      equals(value: unknown): IQuery<DBModel>
      ne(value: unknown): IQuery<DBModel>
      notEquals(value: unknown): IQuery<DBModel>
      nin(array: Array<unknown>): IQuery<DBModel>
      in(array: Array<unknown>): IQuery<DBModel>
      hint(column: string): IQuery<DBModel>
      notIn(array: Array<unknown>): IQuery<DBModel>
      as(alias: string): IQuery<DBModel>
      regex(regex: RegExp): IQuery<DBModel>
    }
  }

  export { SDK }
}
