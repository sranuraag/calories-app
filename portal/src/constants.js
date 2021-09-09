const host = 'http://localhost:3001'; 

const constants = {
    users: host + '/users',
    login: host + '/users/login',
    foodentry: host + '/foodentry',
    daily_limit_exceeded_report: host + '/foodentry/daily_limit_exceeded_report',
    nutritionix_api: 'https://trackapi.nutritionix.com/v2/search/instant',
    nutritionix_app_id: 'a3f4862d',
    nutritionix_app_key: '24e055db6528243297f9b6baf36d5233',
    nutritionix_remote_user_id: 0
}

export default constants; 