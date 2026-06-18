export interface InstagramProfile {
    username: string
    full_name: string
    biography: string
    profile_pic_url: string
    follower_count: number
    following_count: number
    media_count: number
    is_private: boolean
    is_verified: boolean
    user_id: string
    external_url: string
    _chaining_results: Array<{
        id: string
        username: string
        full_name: string
        profile_pic_url: string
        is_private: boolean
        is_verified: boolean
    }>
}

export interface StalkeaResponse {
    source: string
    data: InstagramProfile
    duration: number
}


export interface InstagramFeedResponse {
    perfil_buscado: PerfilBuscado
    fonte: string
    fonte_api: string
    perfis_na_lista: number
    perfis_publicos: number
    lista_perfis_publicos: PerfilPublico[]
    posts: PostItem[]
    total_posts: number
    duracao_ms: number
}
export interface PerfilBuscado {
    username: string
    full_name: string
    is_private: boolean
    profile_pic_url: string
}
export interface PerfilPublico {
    username: string
    full_name: string
    profile_pic_url: string
    is_verified: boolean
}
export interface PostItem {
    de_usuario: UsuarioBasico
    post: Post
}
export interface UsuarioBasico {
    username: string
    full_name: string
    profile_pic_url: string
}
export interface Post {
    id: string
    shortcode: string
    image_url: string | null
    video_url: string | null
    is_video: boolean
    caption: string
    like_count: number
    comment_count: number
    taken_at: number // unix timestamp (seconds)
}