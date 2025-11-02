import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
  ScanCommand,
  BatchWriteItemCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand as DocQueryCommand,
  ScanCommand as DocScanCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

export type DynamoConfig = {
  tableName: string;
  region: string;
  endpoint?: string;
  partitionKey?: string;
  sortKey?: string;
  gsiPartitionKey?: string;
  gsiSortKey?: string;
};

export class DynamoRepositoryError extends Error { }

export class DynamoDBResources {
  private config: DynamoConfig;
  private ddb: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;

  constructor(config: DynamoConfig) {
    this.config = {
      partitionKey: "PK",
      sortKey: "SK",
      ...config,
    };
    this.ddb = new DynamoDBClient({
      region: this.config.region,
      endpoint: this.config.endpoint,
    });
    this.docClient = DynamoDBDocumentClient.from(this.ddb, {
      marshallOptions: { removeUndefinedValues: true },
      unmarshallOptions: {},
    });
  }

  async put(
    item: Record<string, any>,
    partitionKey: string,
    sortKey?: string
  ): Promise<void> {
    console.log("[DynamoDBResources] ========== put INICIANDO ==========");
    console.log("[DynamoDBResources] Item recebido:", JSON.stringify(item, null, 2));
    console.log("[DynamoDBResources] PartitionKey recebido:", partitionKey);
    console.log("[DynamoDBResources] SortKey recebido:", sortKey);
    console.log("[DynamoDBResources] TableName:", this.config.tableName);
    console.log("[DynamoDBResources] Region:", this.config.region);
    
    const pk = this.config.partitionKey!;
    const sk = this.config.sortKey!;
    const itemToPut = { ...item, [pk]: partitionKey };
    if (sortKey) itemToPut[sk] = sortKey;
    
    console.log("[DynamoDBResources] Item final para salvar:", JSON.stringify(itemToPut, null, 2));
    
    try {
      console.log("[DynamoDBResources] Enviando PutCommand para DynamoDB...");
      await this.docClient.send(
        new PutCommand({
          TableName: this.config.tableName,
          Item: itemToPut,
        })
      );
      console.log("[DynamoDBResources] ✅ PutCommand executado com sucesso");
    } catch (e: any) {
      console.error("[DynamoDBResources] ❌❌❌ ERRO NO PUT ❌❌❌");
      console.error("[DynamoDBResources] Error name:", e.name);
      console.error("[DynamoDBResources] Error message:", e.message);
      console.error("[DynamoDBResources] Error code:", e.code);
      console.error("[DynamoDBResources] Error stack:", e.stack);
      console.error("[DynamoDBResources] Error completo:", JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
      throw new DynamoRepositoryError(e.message);
    }
  }

  async get(partitionKey: string, sortKey?: string): Promise<any | null> {
    const pk = this.config.partitionKey!;
    const sk = this.config.sortKey!;
    const Key: Record<string, any> = { [pk]: partitionKey };
    if (sortKey) Key[sk] = sortKey;
    try {
      const res = await this.docClient.send(
        new GetCommand({
          TableName: this.config.tableName,
          Key,
        })
      );
      return res.Item ?? null;
    } catch (e: any) {
      throw new DynamoRepositoryError(e.message);
    }
  }

  async update(
    partitionKey: string,
    sortKey: string,
    updateDict: Record<string, any>
  ): Promise<any> {
    const pk = this.config.partitionKey!;
    const sk = this.config.sortKey!;
    // Generate Expression
    const keys = Object.keys(updateDict);
    const exprNames = keys.reduce(
      (acc, k, i) => ({ ...acc, [`#k${i}`]: k }),
      {}
    );
    const exprValues = keys.reduce(
      (acc, k, i) => ({ ...acc, [`:v${i}`]: updateDict[k] }),
      {}
    );
    const updateExpr =
      "SET " + keys.map((_, i) => `#k${i} = :v${i}`).join(", ");
    try {
      const res = await this.docClient.send(
        new UpdateCommand({
          TableName: this.config.tableName,
          Key: { [pk]: partitionKey, [sk]: sortKey },
          UpdateExpression: updateExpr,
          ExpressionAttributeNames: exprNames,
          ExpressionAttributeValues: exprValues,
          ReturnValues: "ALL_NEW",
        })
      );
      return res.Attributes!;
    } catch (e: any) {
      throw new DynamoRepositoryError(e.message);
    }
  }

  async delete(partitionKey: string, sortKey?: string): Promise<void> {
    const pk = this.config.partitionKey!;
    const sk = this.config.sortKey!;
    const Key: Record<string, any> = { [pk]: partitionKey };
    if (sortKey) Key[sk] = sortKey;
    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: this.config.tableName,
          Key,
        })
      );
    } catch (e: any) {
      throw new DynamoRepositoryError(e.message);
    }
  }

  async queryAll(
    partitionKeyValue: string,
    beginsWith?: string,
    indexName?: string,
    partitionKeyName?: string
  ): Promise<any[]> {
    // Name do PK: se for index, pode ser diferente
    const pk = partitionKeyName || this.config.partitionKey!;
    const sk = this.config.sortKey!;

    const KeyConditionExpression = beginsWith
      ? `#pk = :pk and begins_with(#sk, :bw)`
      : `#pk = :pk`;

    const ExpressionAttributeNames: any = { "#pk": pk };
    const ExpressionAttributeValues: any = { ":pk": partitionKeyValue };
    if (beginsWith) {
      ExpressionAttributeNames["#sk"] = sk;
      ExpressionAttributeValues[":bw"] = beginsWith;
    }

    let ExclusiveStartKey: any = undefined;
    const Items: any[] = [];
    do {
      const input: any = {
        TableName: this.config.tableName,
        KeyConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        IndexName: indexName,
        ExclusiveStartKey,
      };
      const res = await this.docClient.send(new DocQueryCommand(input));
      Items.push(...(res.Items ?? []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return Items;
  }

  async scanAll(extra: Record<string, any> = {}): Promise<any[]> {
    let ExclusiveStartKey: any = undefined;
    const Items: any[] = [];
    do {
      const input = {
        TableName: this.config.tableName,
        ...extra,
        ExclusiveStartKey,
      };
      const res = await this.docClient.send(new DocScanCommand(input));
      Items.push(...(res.Items ?? []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return Items;
  }

  async batchWrite(items: Record<string, any>[]): Promise<void> {
    const putRequests = items.map((Item) => ({ PutRequest: { Item } }));
    try {
      await this.docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [this.config.tableName]: putRequests,
          },
        })
      );
    } catch (e: any) {
      throw new DynamoRepositoryError(e.message);
    }
  }
}
