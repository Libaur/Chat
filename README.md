## [Deploy](https://chat-simply-app.netlify.app/)
#### ⮕ *[email](https://www.minuteinbox.com/) для тестирования*

# Алгоритм работы приложения.

Модальные окна наследуют управление от единого класса.  
Пользователь авторизован - загружается история.  
Сообщения выстраиваются по почтовому ящику из кук.  
Прочитываются наведением курсора - обновляются в localstorage.

1. **Пользователя встречает окно авторизации**  
    _Алгоритм:_
    - Открывается первым при использовании приложения
    - Проверяет куки на заголовок о наличии токена авторизации
    - Не откроется, если заголовок есть
2. **Переход в окно подтверждения токена**  
    _Алгоритм:_
    - Открывается поверх авторизации
    - Отправляет токен и почтовый ящик в куки и закрывается
    - Следом за собой закрывает авторизацию
3. **Смена имени**  
    _Алгоритм:_
    - Открывается по клику настроек
    - Отправляет имя на сервер и закрывается


1. **Пометка сообщений как прочитанные**:
    
    - Реализована наведением мыши на сообщение.
        
    - Изменения сохраняются локально.
        
2. **Корректировка орфографии**:
    
    - Доступно по клику на кнопку "правописание" в левом нижнем углу сообщения.
        
    - Изменения сохраняются локально.
        
3. **Навигация по истории сообщений**:
    
    - Доступно по нажатию кнопки со стрелкой в правом нижнем углу.
        
    - Возвращает к недавним сообщениям.
        
4. **Выход из чата**:
    
    - Доступно по нажатию кнопки выйти в правом верхнем углу.
        
    - Закрывает текущий чат.
