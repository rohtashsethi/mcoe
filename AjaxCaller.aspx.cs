using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
/// AJAX Caller
/// </summary>
public partial class AjaxCaller : System.Web.UI.Page
{
    const bool isDEV = false;
    static string userID = string.Empty;
    static string userPWD = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    [System.Web.Services.WebMethod]
    public static string GetMethod(string serviceURL)
    {
        string output = string.Empty;
        string apiMethod = string.Empty;

        try
        {
            //var responseObj = RestHelper.GetBasicAuthenication(serviceURL, apiMethod, "DashboardUser", "test@123");
            var responseObj = RestHelper.Get(serviceURL, apiMethod);
            if (responseObj.ResponseStatus == RestSharp.ResponseStatus.Completed)
            {
                output = responseObj.Content;
            }
            if (responseObj.ResponseStatus == RestSharp.ResponseStatus.Error)
            {
                throw new Exception(responseObj.ErrorMessage);
            }
        }
        catch (Exception ex)
        {
        }

        return output;
    }

    [System.Web.Services.WebMethod]
    public static string ProxyPostMethod(string methodName, string jsonData, bool fromDev)
    {
        string output = string.Empty;
        string apiMethod = string.Empty;
        string serviceURL;
        string serviceDomain = string.Empty;
        if (fromDev)
        {
            serviceDomain = ConfigurationManager.AppSettings["DevService"];
            userID = "DashboardUser";
            userPWD = "test@123";
        }
        else
        {
            serviceDomain = ConfigurationManager.AppSettings["ProductionService"];
            userID = "DashboardUser";
            userPWD = "Admin&0987";
        }

        serviceURL = serviceDomain;

        if (jsonData != null && jsonData.Length > 0)
        {
            try
            {
                var responseObj = RestHelper.PostBasicAuthenication(serviceURL, methodName, userID, userPWD, jsonData);
                if (responseObj.ResponseStatus == RestSharp.ResponseStatus.Completed)
                {
                    output = responseObj.Content;
                }
            }
            catch (Exception ex)
            {
                output = ex.Message;
            }
        }

        return output;
    }




    [System.Web.Services.WebMethod]
    public static string ProxyGetMethod(string serviceURL, bool fromDev)
    {
        string output = string.Empty;
        string apiMethod = string.Empty;

        string serviceDomain = string.Empty;
        if (fromDev)
        {
            serviceDomain = ConfigurationManager.AppSettings["DevService"];
            userID = "DashboardUser";
            userPWD = "test@123";
        }
        else
        {
            serviceDomain = ConfigurationManager.AppSettings["ProductionService"];
            userID = "DashboardUser";
            userPWD = "Admin&0987";
        }

        serviceURL = serviceDomain + serviceURL;

        try
        {
            var responseObj = RestHelper.GetBasicAuthenication(serviceURL, apiMethod, userID, userPWD);
            if (responseObj.ResponseStatus == RestSharp.ResponseStatus.Completed)
            {
                output = responseObj.Content;
            }
            if (responseObj.ResponseStatus == RestSharp.ResponseStatus.Error)
            {
                throw new Exception(responseObj.ErrorMessage);
            }
        }
        catch (Exception ex)
        {
        }

        return output;
    }

}