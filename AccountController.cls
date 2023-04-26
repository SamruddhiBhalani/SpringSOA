public with sharing class AccountController {
    @AuraEnabled(cacheable = true)
    public static List<Account> getAccountListRecent(){
        return [SELECT Id, Name, Type, Industry from Account ORDER BY createdDate DESC LIMIT 10];
    }

    @AuraEnabled(cacheable = true)
    public static void getHttpCallout(){
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://postman-echo.com/get?foo1=bar1&foo2=bar2');
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            // If the request is successful, parse the JSON response.
            if(response.getStatusCode() == 200) {
                System.debug(response.getBody());
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}