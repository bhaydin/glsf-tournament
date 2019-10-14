using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System;

namespace ServerDatabase.Controllers
{
    [Route("api/fishes")]
    public class DataController : Controller
    {
        public class FishModel {
            public double Weight { set; get; }
            public double Length { set; get; }
            public string Species { set; get; }
            public string Image { set; get; }
            public string Date { set; get; }
            public int TagID { set; get; }
        }

        const string connection = "mongodb://localhost:27017";

        [HttpPost]
        public FishModel InsertFish([FromBody] FishModel body) {
            var client = new MongoClient(connection);
            var fishDB = client.GetDatabase("fish_test");
            var fishCollection = fishDB.GetCollection<BsonDocument>("fish_entries");
            var fish = new BsonDocument {
                { "Date", body.Date},
                { "Image", body.Image},
                { "Length", body.Length},
                { "Species", body.Species},
                { "TagID", body.TagID},
                { "Weight", body.Weight}};
            fishCollection.InsertOne(fish);
            return body;
        }
    }
}
