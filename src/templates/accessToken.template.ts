
function accessTokenTemplate(token: string, id: string): string {
    return (
        `<main>
            Выполнен запрос токена<br />
            Токен администратора: ${token}<br />
            ID администратора: ${id}<br />
        </main>`
    )
}