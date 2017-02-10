using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// RestHelper
/// </summary>
public class RestHelper
{
    public RestHelper()
    {

    }

    public static IRestResponse Get(string baseUrl, string resourceUrl)
    {
        var client = new RestClient(baseUrl);
        var request = new RestRequest(resourceUrl, Method.GET);
        //request.AddParameter("text/json", json, ParameterType.RequestBody);
        request.RequestFormat = DataFormat.Json;
        return client.Execute(request);
    }

    public static IRestResponse GetBasicAuthenication(string baseUrl, string resourceUrl, string userName, string password)
    {
        var client = new RestClient(baseUrl);
        client.Authenticator = new HttpBasicAuthenticator(userName, password);
        var request = new RestRequest(resourceUrl, Method.GET);
        //request.AddParameter("text/json", json, ParameterType.RequestBody);
        request.RequestFormat = DataFormat.Json;
        return client.Execute(request);
    }

    public static IRestResponse Post(string baseUrl, string resourceUrl, string json)
    {
        var client = new RestClient(baseUrl);
        var request = new RestRequest(resourceUrl, Method.POST);
        request.AddParameter("text/json", json, ParameterType.RequestBody);
        request.RequestFormat = DataFormat.Json;
        return client.Execute(request);
    }

    public static IRestResponse PostBasicAuthenication(string baseUrl, string resourceUrl, string userName, string password, string json)
    {
        var client = new RestClient(baseUrl);
        client.Authenticator = new HttpBasicAuthenticator(userName, password);
        var request = new RestRequest(resourceUrl, Method.POST);
        request.AddParameter("application/json", json, ParameterType.RequestBody);
        request.RequestFormat = DataFormat.Json;
        return client.Execute(request);
    }

}