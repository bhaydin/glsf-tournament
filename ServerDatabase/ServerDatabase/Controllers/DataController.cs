using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ServerDatabase.Controllers
{

    [Route("api/fishes")]
    public class DataController : Controller
    {
        const string connection = "mongodb://localhost:27017";
        const string dbName = "fish";
        const string collectionName = "fishes";
        static MongoClient client = new MongoClient(connection);
        static IMongoDatabase fishDB = client.GetDatabase(dbName);
        static IMongoCollection<FishModel> fishCollection = fishDB.GetCollection<FishModel>(collectionName);

        public class FishModel {

            [BsonElement(elementName: "Weight")]
            public double Weight { set; get; }

            [BsonElement(elementName: "Length")]
            public double Length { set; get; }

            [BsonElement(elementName: "Species")]
            public string Species { set; get; }

            [BsonElement(elementName: "Image")]
            public string Image { set; get; }

            [BsonElement(elementName: "Date")]
            public string Date { set; get; }

            [BsonElement(elementName: "TagID")]
            public int TagID { set; get; }
        }

        [HttpPost]
        public async Task<FishModel> InsertFish([FromBody] FishModel body) {
            await fishCollection.InsertOneAsync(body);
            return body;
        }

        [HttpGet("{queryStart}")]
        public async Task<string> GetFish(int queryStart)
        {
            int upperQuery = queryStart+100;
            var bsonItems = await fishCollection.Find(_ => true).Project(Builders<FishModel>.Projection.Exclude("_id")).Skip(queryStart).Limit(upperQuery).ToListAsync();
            List<FishModel> fishes = new List<FishModel>();
            foreach (var fish in bsonItems) {
                var fish_obj = BsonSerializer.Deserialize<FishModel>(fish);
                fishes.Add(fish_obj);
            }
            return JsonConvert.SerializeObject(fishes);
        }

    }
}