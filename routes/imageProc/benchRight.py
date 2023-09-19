import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# 벤치 프레스 카운팅 기준 각도
BENCH_PRESS_ANGLE_DOWN = 60
BENCH_PRESS_ANGLE_UP = 150 

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

counter = 0
stage = "up"

cap = cv2.VideoCapture(0)

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        results = pose.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        try:
            landmarks = results.pose_landmarks.landmark

            # 오른쪽 각도 산출
            right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
            right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

            angle = calculate_angle(right_shoulder, right_elbow, right_wrist)

            cv2.putText(image, "Angle: " + str(angle),
                        tuple(np.multiply(right_elbow, [640, 480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

            ## 벤치 프레스 카운터 로직
            if angle < BENCH_PRESS_ANGLE_DOWN and stage == "up":
                stage = "down"
            if angle > BENCH_PRESS_ANGLE_UP and stage == 'down':
                stage = "up"
                counter += 1
                print(counter)

        except:
            pass

        # 횟수 문자열 및 크기 정의
        benchpress_text = str(counter)
        text_scale = 3
        text_thickness = 6
        font = cv2.FONT_HERSHEY_SIMPLEX

        # 텍스트 크기 및 중심 위치 계산
        text_size = cv2.getTextSize(benchpress_text, font, text_scale, text_thickness)[0]
        text_x = (image.shape[1] - text_size[0]) // 2
        text_y = (image.shape[0] + text_size[1]) // 2

        # 화면에 횟수 표시
        cv2.putText(image, benchpress_text,
                    (text_x, text_y), font, text_scale, (255, 255, 255), text_thickness, cv2.LINE_AA)

        cv2.imshow('Bench Press Counter Feed', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()