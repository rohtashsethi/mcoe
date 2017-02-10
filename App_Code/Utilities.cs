using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Utilities
/// </summary>
public class Utilities
{
	public Utilities()
	{
		//
		// TODO: Add constructor logic here
		//
	}

    public static string ProxyGetMethod(string apiURL, string apiMethod)
    {
        string output = string.Empty;

        var responseObj = RestHelper.GetBasicAuthenication(apiURL, apiMethod, "user", "password");
        if (responseObj.ResponseStatus == RestSharp.ResponseStatus.Completed)
        {
            output = responseObj.Content;
        }
        if (responseObj.ResponseStatus == RestSharp.ResponseStatus.Error)
        {
            throw new Exception(responseObj.ErrorMessage);
        }
        return output;
    }
}